/**
 * Type definitions for Panorama-style panel API
 */
interface Panel {
	id: string;
	BHasKeyFocus(): boolean;
	BHasDescendantKeyFocus(): boolean;
	BHasClass(className: string): boolean;
	SetFocus(): void;
	AddClass(className: string): void;
	RemoveClass(className: string): void;
	SetPanelEvent(eventName: string, callback: () => void): void;
}

interface PanoramaAPI {
	(selector: string): Panel;
	GetContextPanel(): Panel;
	Each<T>(items: T[] | Record<string, T>, callback: (value: T, key?: string | number) => void): void;
	RegisterForUnhandledEvent(eventName: string, callback: () => void): void;
}

declare const $: PanoramaAPI;

type HoverPanelStyleMap = Record<string, string>;
type MouseOverCallback = (panel: Panel) => void;

/**
 * Helper function to add mouseover/mouseout events when hovering over a menu or content panel
 * which then adds/removes a class from an ancestor panel
 */
const setupMenuAndContentHoverEvents = (
	menuPanelID: string,
	menuHoverClass: string,
	contentPanelID: string,
	contentHoverClass: string,
	ancestorPanelID: string
): void => {
	const ancestorPanel: Panel = $(`#${ancestorPanelID}`);

	const hoverItemStyles: HoverPanelStyleMap = {
		[menuPanelID]: menuHoverClass,
		[contentPanelID]: contentHoverClass
	};

	setupPanelsHoverEvents(hoverItemStyles, ancestorPanel, (pPanel: Panel): void => {
		// mouse is hovering over one of the panels in hoverItemStyles. If it is the target container panel, and focus
		// is still in this context, pull focus to that panel
		const pContext: Panel = $.GetContextPanel();
		if (!pContext.BHasKeyFocus() && !pContext.BHasDescendantKeyFocus() && !pContext.BHasClass('Loading')) {
			return;
		}

		if (pPanel.id === contentPanelID && !pPanel.BHasKeyFocus() && !pPanel.BHasDescendantKeyFocus()) {
			pPanel.SetFocus();
		}
	});
};

/**
 * For a panel on mouseover add and remove classes on a parent
 */
const setupPanelHoverEvent = (
	panel: Panel,
	ancestorPanel: Panel,
	hoverClass: string,
	uniqueClasses: string[],
	fnMouseOverCallback?: MouseOverCallback
): void => {
	panel.SetPanelEvent(
		'onmouseover',
		(): void => {
			ancestorPanel.AddClass(hoverClass);
			// now see what classes we need to remove
			$.Each(uniqueClasses, (classValue: string): void => {
				if (classValue !== hoverClass) {
					ancestorPanel.RemoveClass(classValue);
				}
			});

			if (fnMouseOverCallback) {
				fnMouseOverCallback(panel);
			}
		}
	);

	$.RegisterForUnhandledEvent('WindowCursorHidden', (): void => {
		$.Each(uniqueClasses, (classValue: string): void => {
			ancestorPanel.RemoveClass(classValue);
		});
	});
};

/**
 * Filters array to unique values only
 */
const onlyUnique = <T>(value: T, index: number, self: T[]): boolean => self.indexOf(value) === index;

/**
 * Manages a map of panels and classes to use when that panel is hovered (and the other classes are removed)
 */
const setupPanelsHoverEvents = (
	hoverPanelStyleMap: HoverPanelStyleMap,
	ancestorPanel: Panel,
	fnMouseOverCallback?: MouseOverCallback
): void => {
	const hoverClasses: string[] = Object.values(hoverPanelStyleMap);
	const uniqueClasses: string[] = [...new Set(hoverClasses)];

	$.Each(uniqueClasses, (classValue: string): void => {
		ancestorPanel.RemoveClass(classValue);
	});

	$.Each(hoverPanelStyleMap, (value: string, key?: string): void => {
		if (key) {
			setupPanelHoverEvent($(`#${key}`), ancestorPanel, hoverPanelStyleMap[key], uniqueClasses, fnMouseOverCallback);
		}
	});
};

export {
	setupMenuAndContentHoverEvents,
	setupPanelHoverEvent,
	setupPanelsHoverEvents,
	onlyUnique,
	type Panel,
	type HoverPanelStyleMap,
	type MouseOverCallback
};
