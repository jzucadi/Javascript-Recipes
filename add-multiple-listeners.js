const utils = typeof utils !== "undefined" ? utils : {};
const WindowObj = typeof Window !== "undefined" ? Window : {};

(() => {
  /**
   * Adds multiple event listeners to an element or window
   * @param {HTMLElement|Window} element
   * @param {string[]} eventsArray
   * @param {Function} handler
   * @param {boolean} [useCapture=false]
   * @param {any[]} [handlerArgs=[]]
   */
  const addMultipleListeners = (
    element,
    eventsArray,
    handler,
    useCapture = false,
    handlerArgs = []
  ) => {
    const errors = {
      element: "First argument must be an HTMLElement or Window object",
      eventsArray: "Second argument must be an array of strings",
      handler: "Third argument must be a function",
      useCapture: "Fourth argument must be a boolean value",
      handlerArgs: "Fifth argument must be an array",
    };

    if (
      !(element instanceof HTMLElement || element instanceof WindowObj)
    ) {
      throw new TypeError(errors.element);
    }

    if (!Array.isArray(eventsArray)) {
      throw new TypeError(errors.eventsArray);
    }

    if (typeof handler !== "function") {
      throw new TypeError(errors.handler);
    }

    if (typeof useCapture !== "boolean" && typeof useCapture !== "undefined") {
      throw new TypeError(errors.useCapture);
    }

    if (!Array.isArray(handlerArgs) && typeof handlerArgs !== "undefined") {
      throw new TypeError(errors.handlerArgs);
    }

    const wrappedHandler = (e) => handler(e, ...handlerArgs);

    eventsArray.forEach((event) => {
      element.addEventListener(event, wrappedHandler, useCapture);
    });
  };

  utils.addMultipleListeners = addMultipleListeners;
})();
