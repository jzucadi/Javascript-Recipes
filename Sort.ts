/**
 * Modern TypeScript table sorter
 *
 * Features:
 * - Click headers to sort columns (toggles asc/desc)
 * - Stable sorting
 * - Per-column type via data-sort-type on <th>: "number" | "string" | "date"
 * - Per-cell override via data-sort-value on <td>/<th>
 * - Automatic type inference (number/date/string) if not specified
 * - Accessible: keyboard (Enter/Space), aria-sort, focusable headers
 * - Works with multiple <tbody> sections (sorts each independently)
 *
 * Usage:
 *   const sorter = new TableSorter('#my-table', { indicatorAsc: '▲', indicatorDesc: '▼' });
 *   // Programmatic:
 *   sorter.sortBy(0, 'asc');
 */

export type SortDirection = 'asc' | 'desc';

export interface TableSorterOptions {
  // Initial sort configuration (optional)
  initialColumn?: number;
  initialDirection?: SortDirection;

  // Comparison behavior
  caseSensitive?: boolean;           // default: false
  locale?: string;                   // default: browser locale
  numericPrecision?: number;         // default: undefined (no rounding)
  customCompare?:
    (a: unknown, b: unknown, columnIndex: number, rowA: HTMLTableRowElement, rowB: HTMLTableRowElement) => number;
  valueGetter?:
    (cell: HTMLTableCellElement, columnIndex: number, row: HTMLTableRowElement) => unknown;

  // Sorting indicators
  showIndicators?: boolean;          // default: true
  indicatorAsc?: string;             // default: '▲'
  indicatorDesc?: string;            // default: '▼'
  indicatorClass?: string;           // default: 'ts-indicator'

  // Styling hooks
  sortableHeaderClass?: string;      // default: 'ts-sortable'
  sortedHeaderClass?: string;        // default: 'ts-sorted'
  sortAscendingClass?: string;       // default: 'ts-asc'
  sortDescendingClass?: string;      // default: 'ts-desc'

  // Empty/NaN handling: where to position empties/NaNs
  empties?: 'first' | 'last';        // default: 'last'
}

/**
 * Column sort type defined on header via data-sort-type.
 */
type ColumnSortType = 'number' | 'string' | 'date';

const DEFAULTS: Required<Pick<
  TableSorterOptions,
  | 'caseSensitive'
  | 'locale'
  | 'showIndicators'
  | 'indicatorAsc'
  | 'indicatorDesc'
  | 'indicatorClass'
  | 'sortableHeaderClass'
  | 'sortedHeaderClass'
  | 'sortAscendingClass'
  | 'sortDescendingClass'
  | 'empties'
>> = {
  caseSensitive: false,
  locale: '',
  showIndicators: true,
  indicatorAsc: '▲',
  indicatorDesc: '▼',
  indicatorClass: 'ts-indicator',
  sortableHeaderClass: 'ts-sortable',
  sortedHeaderClass: 'ts-sorted',
  sortAscendingClass: 'ts-asc',
  sortDescendingClass: 'ts-desc',
  empties: 'last',
};

export class TableSorter {
  private table: HTMLTableElement;
  private options: TableSorterOptions & typeof DEFAULTS;
  private headers: HTMLTableCellElement[] = [];
  private lastSort: { index: number; direction: SortDirection } | null = null;

  constructor(table: string | HTMLTableElement, options: TableSorterOptions = {}) {
    const el = typeof table === 'string' ? document.querySelector<HTMLTableElement>(table) : table;
    if (!el) throw new Error('TableSorter: table element not found.');
    if (el.tagName !== 'TABLE') throw new Error('TableSorter: provided element is not a <table>.');

    this.table = el;
    this.options = { ...DEFAULTS, ...options };

    this.setupHeaders();
    this.attachEvents();

    if (typeof options.initialColumn === 'number') {
      this.sortBy(options.initialColumn, options.initialDirection ?? 'asc');
    } else {
      // Reset ARIA states
      this.headers.forEach(h => h.setAttribute('aria-sort', 'none'));
    }
  }

  /**
   * Sort the table by a given column index and optional direction.
   * Toggles direction if not provided and the column is already sorted.
   */
  public sortBy(columnIndex: number, direction?: SortDirection): void {
    if (columnIndex < 0 || columnIndex >= this.headers.length) return;

    const resolvedDirection: SortDirection = direction ?? this.toggleDirection(columnIndex);
    this.lastSort = { index: columnIndex, direction: resolvedDirection };

    // Update header visuals/ARIA
    this.updateHeaderState(columnIndex, resolvedDirection);

    // Sort each tbody independently to preserve grouping
    const tbodies = Array.from(this.table.tBodies);
    for (const tbody of tbodies) {
      const rows = Array.from(tbody.rows);
      // Decorate rows with original index for stable sorting
      const decorated = rows.map((row, i) => ({ row, i }));

      decorated.sort((A, B) => {
        const aVal = this.getCellSortValue(A.row, columnIndex);
        const bVal = this.getCellSortValue(B.row, columnIndex);

        let cmp = this.compareValues(aVal, bVal, columnIndex, A.row, B.row);
        if (resolvedDirection === 'desc') cmp = -cmp;
        if (cmp === 0) return A.i - B.i; // stable tie-break
        return cmp;
      });

      // Re-append in new order
      for (const { row } of decorated) {
        tbody.appendChild(row);
      }
    }
  }

  private toggleDirection(columnIndex: number): SortDirection {
    if (this.lastSort && this.lastSort.index === columnIndex) {
      return this.lastSort.direction === 'asc' ? 'desc' : 'asc';
    }
    return 'asc';
  }

  private setupHeaders(): void {
    const thead = this.table.tHead;
    let headerRow: HTMLTableRowElement | null = null;

    if (thead && thead.rows.length) {
      // Prefer the last row in the thead as the clickable header row
      headerRow = thead.rows[thead.rows.length - 1];
    } else if (this.table.rows.length) {
      // Fallback: use the first table row
      headerRow = this.table.rows[0];
    }

    if (!headerRow) return;
    this.headers = Array.from(headerRow.cells);

    // Make headers interactive and accessible
    this.headers.forEach((th, idx) => {
      th.tabIndex = 0; // focusable
      th.setAttribute('role', 'button');
      th.setAttribute('aria-sort', 'none');
      th.dataset.columnIndex = String(idx);
      th.classList.add(this.options.sortableHeaderClass);

      if (this.options.showIndicators) {
        // Inject a dedicated indicator span if not present
        const indicator = document.createElement('span');
        indicator.className = this.options.indicatorClass;
        indicator.style.marginLeft = '0.35em';
        indicator.setAttribute('aria-hidden', 'true');
        th.appendChild(indicator);
      }
    });
  }

  private attachEvents(): void {
    // Use event delegation on the header row if possible; fall back to per-cell listeners
    const headerContainer: HTMLElement | null = this.table.tHead ?? this.headers[0]?.parentElement ?? null;
    if (!headerContainer) return;

    headerContainer.addEventListener('click', (e) => {
      const th = this.findHeaderFromEvent(e);
      if (!th) return;
      const idx = Number(th.dataset.columnIndex);
      this.sortBy(idx);
    });

    headerContainer.addEventListener('keydown', (e: KeyboardEvent) => {
      const th = this.findHeaderFromEvent(e);
      if (!th) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = Number(th.dataset.columnIndex);
        this.sortBy(idx);
      }
    });
  }

  private findHeaderFromEvent(e: Event): HTMLTableCellElement | null {
    let target = e.target as HTMLElement | null;
    while (target && target !== this.table) {
      if (target instanceof HTMLTableCellElement && this.headers.includes(target)) {
        return target;
      }
      target = target.parentElement;
    }
    return null;
  }

  private updateHeaderState(activeIndex: number, direction: SortDirection): void {
    this.headers.forEach((th, idx) => {
      const indicator = th.querySelector<HTMLElement>(`.${this.options.indicatorClass}`);
      const isActive = idx === activeIndex;

      th.classList.toggle(this.options.sortedHeaderClass, isActive);
      th.classList.toggle(this.options.sortAscendingClass, isActive && direction === 'asc');
      th.classList.toggle(this.options.sortDescendingClass, isActive && direction === 'desc');

      th.setAttribute('aria-sort', isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none');

      if (indicator) {
        indicator.textContent = isActive
          ? (direction === 'asc' ? this.options.indicatorAsc : this.options.indicatorDesc)
          : '';
      }
    });
  }

  private getCellSortValue(row: HTMLTableRowElement, columnIndex: number): unknown {
    // In tables with colspans, cellIndex may not map cleanly; we assume a simple 1:1 mapping or that
    // the clickable header row aligns with body cells. For advanced spanning tables, consider providing
    // a custom valueGetter in options or data-sort-value per cell.
    const cell = row.cells.item(columnIndex);
    if (!cell) return '';

    if (this.options.valueGetter) {
      return this.options.valueGetter(cell, columnIndex, row);
    }

    // Allow per-cell override
    const override = (cell as HTMLElement).dataset.sortValue;
    if (override != null) return override;

    // Default: text content
    return (cell.textContent ?? '').trim();
  }

  private headerType(columnIndex: number): ColumnSortType | null {
    const th = this.headers[columnIndex];
    if (!th) return null;
    const t = (th as HTMLElement).dataset.sortType?.toLowerCase().trim();
    if (t === 'number' || t === 'string' || t === 'date') return t;
    return null;
  }

  private compareValues(
    a: unknown,
    b: unknown,
    columnIndex: number,
    rowA: HTMLTableRowElement,
    rowB: HTMLTableRowElement
  ): number {
    if (this.options.customCompare) {
      return this.options.customCompare(a, b, columnIndex, rowA, rowB);
    }

    const typeHint = this.headerType(columnIndex);

    // Normalize empties
    const isEmpty = (v: unknown) =>
      v === null || v === undefined || (typeof v === 'string' && v.trim() === '');

    const aEmpty = isEmpty(a);
    const bEmpty = isEmpty(b);
    if (aEmpty || bEmpty) {
      if (aEmpty && bEmpty) return 0;
      return this.options.empties === 'first' ? (aEmpty ? -1 : 1) : (aEmpty ? 1 : -1);
    }

    // Try type-directed comparison, falling back to inference
    if (typeHint === 'number') return this.compareAsNumber(a, b);
    if (typeHint === 'date') return this.compareAsDate(a, b);
    if (typeHint === 'string') return this.compareAsString(a, b);

    // Infer type: number -> date -> string
    const numCmp = this.compareAsNumber(a, b);
    if (!Number.isNaN(numCmp)) return numCmp;

    const dateCmp = this.compareAsDate(a, b);
    if (!Number.isNaN(dateCmp)) return dateCmp;

    return this.compareAsString(a, b);
  }

  private compareAsNumber(a: unknown, b: unknown): number {
    const na = this.toNumber(a);
    const nb = this.toNumber(b);
    if (Number.isNaN(na) || Number.isNaN(nb)) return Number.NaN;

    const { numericPrecision } = this.options;
    const aa = typeof numericPrecision === 'number' ? this.round(na, numericPrecision) : na;
    const bb = typeof numericPrecision === 'number' ? this.round(nb, numericPrecision) : nb;

    return aa < bb ? -1 : aa > bb ? 1 : 0;
  }

  private compareAsDate(a: unknown, b: unknown): number {
    const da = this.toDate(a);
    const db = this.toDate(b);
    if (!da || !db) return Number.NaN;
    return da.getTime() - db.getTime();
  }

  private compareAsString(a: unknown, b: unknown): number {
    const sa = String(a);
    const sb = String(b);
    const sensitivity = this.options.caseSensitive ? 'variant' : 'base';
    return sa.localeCompare(sb, this.options.locale || undefined, { sensitivity, numeric: false });
  }

  private toNumber(v: unknown): number {
    if (typeof v === 'number') return v;
    if (typeof v !== 'string') return Number.NaN;
    // Strip common formatting (commas, spaces)
    const cleaned = v.replace(/[\s,]+/g, '');
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : Number.NaN;
  }

  private toDate(v: unknown): Date | null {
    if (v instanceof Date) return Number.isFinite(v.getTime()) ? v : null;
    const s = String(v);
    const t = Date.parse(s);
    return Number.isFinite(t) ? new Date(t) : null;
  }

  private round(n: number, precision: number): number {
    const f = Math.pow(10, precision);
    return Math.round(n * f) / f;
  }
}

/**
 * Convenience function to enable sorting on a table.
 */
export function enableTableSort(table: string | HTMLTableElement, options?: TableSorterOptions): TableSorter {
  return new TableSorter(table, options);
}
