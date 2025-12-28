type ParentElement = HTMLElement | Window;

interface Utils {
  /**
   * Checks if 'child' is a descendant of 'parent' using the built-in Node.contains method.
   * @param parent - The potential parent element or window
   * @param child - The potential child element
   * @returns true if child is a descendant of parent, false otherwise
   * @throws {TypeError} If parent is not an HTMLElement or Window
   * @throws {TypeError} If child is not an HTMLElement
   */
  isDescendant(parent:  ParentElement, child: HTMLElement): boolean;
}

const utils: Utils = {
  isDescendant(parent: ParentElement, child:  HTMLElement): boolean {
    if (!(parent instanceof HTMLElement || parent instanceof Window)) {
      throw new TypeError(
        `Parent must be an HTMLElement or Window. It is currently a(n) ${typeof parent}`
      );
    }
    
    if (!(child instanceof HTMLElement)) {
      throw new TypeError(
        `Child must be an HTMLElement. It is currently a(n) ${typeof child}`
      );
    }

    // For Window, perform the check only if both are window objects
    if (parent instanceof Window && child instanceof Window) {
      return parent === child;
    }
    
    // For elements, use built-in contains
    if (parent instanceof HTMLElement) {
      return parent.contains(child);
    }

    return false;
  },
};

export default utils;
