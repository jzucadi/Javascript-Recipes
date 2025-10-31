/**
 * Helper function to add mouseover/mouseout events when hovering over a menu or content panel
 * which then adds/removes a class from an ancestor panel
 */
const setupMenuAndContentHoverEvents = (menuPanelID, menuHoverClass, contentPanelID, contentHoverClass, ancestorPanelID) => {
	const ancestorPanel = $(`#${ancestorPanelID}`);

	const hoverItemStyles = {
		[menuPanelID]: menuHoverClass,
		[contentPanelID]: contentHoverClass
	};

	setupPanelsHoverEvents(hoverItemStyles, ancestorPanel, (pPanel) => {
		// mouse is hovering over one of the panels in hoverItemStyles. If it is the target container panel, and focus
		// is still in this context, pull focus to that panel
		const pContext = $.GetContextPanel();
		if (!pContext.BHasKeyFocus() && !pContext.BHasDescendantKeyFocus() && !pContext.BHasClass('Loading')) {
			return;
		}

		if (pPanel.id === contentPanelID && !pPanel.BHasKeyFocus() && !pPanel.BHasDescendantKeyFocus()) {
			pPanel.SetFocus();
		}
	});
};


/**
 * for a panel on mouseover add and remove classes on a parent
 */
const setupPanelHoverEvent = (panel, ancestorPanel, hoverClass, uniqueClasses, fnMouseOverCallback) => {
	panel.SetPanelEvent(
		'onmouseover',
		() => {
			ancestorPanel.AddClass(hoverClass);
			// now see what classes we need to remove
			$.Each(uniqueClasses, (classValue) => {
				if (classValue !== hoverClass) {
					ancestorPanel.RemoveClass(classValue);
				}
			});

			if (fnMouseOverCallback) {
				fnMouseOverCallback(panel);
			}
		}
	);

	$.RegisterForUnhandledEvent('WindowCursorHidden', () => {
		$.Each(uniqueClasses, (classValue) => {
			ancestorPanel.RemoveClass(classValue);
		});
	});
};


/**
 * Filters array to unique values only
 */
const onlyUnique = (value, index, self) => self.indexOf(value) === index;


/**
 * Manages a map of panels and classes to use when that panel is hovered (and the other classes are removed)
 */
const setupPanelsHoverEvents = (hoverPanelStyleMap, ancestorPanel, fnMouseOverCallback) => {
	const hoverClasses = Object.values(hoverPanelStyleMap);
	const uniqueClasses = [...new Set(hoverClasses)];

	$.Each(uniqueClasses, (classValue) => {
		ancestorPanel.RemoveClass(classValue);
	});

	$.Each(hoverPanelStyleMap, (value, key) => {
		setupPanelHoverEvent($(`#${key}`), ancestorPanel, hoverPanelStyleMap[key], uniqueClasses, fnMouseOverCallback);
	});
};
