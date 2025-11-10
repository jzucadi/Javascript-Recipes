type EventTarget = HTMLElement | Window;
type EventHandler<T extends any[] = any[]> = (event: Event, ...args: T) => void;

interface Utils {
  addMultipleListeners: typeof addMultipleListeners;
  [key: string]: any;
}

declare global {
  interface Window {
    utils?: Utils;
  }
}

const utils: Utils = (typeof window !== "undefined" && window.utils) || ({} as Utils);

(() => {
  /**
   * Adds multiple event listeners to an element or window
   * @param element - The HTML element or Window object to attach listeners to
   * @param eventsArray - Array of event names to listen for
   * @param handler - Event handler function
   * @param useCapture - Whether to use capture phase
   * @param handlerArgs - Additional arguments to pass to the handler
   */
  const addMultipleListeners = <T extends any[] = any[]>(
    element: EventTarget,
    eventsArray: string[],
    handler: EventHandler<T>,
    useCapture: boolean = false,
    handlerArgs: T = [] as unknown as T
  ): void => {
    const errors = {
      element: "First argument must be an HTMLElement or Window object",
      eventsArray: "Second argument must be an array of strings",
      handler: "Third argument must be a function",
      useCapture: "Fourth argument must be a boolean value",
      handlerArgs: "Fifth argument must be an array",
    } as const;

    if (
      !(element instanceof HTMLElement || element instanceof Window)
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

    const wrappedHandler = (e: Event): void => handler(e, ...handlerArgs);

    eventsArray.forEach((event: string) => {
      element.addEventListener(event, wrappedHandler, useCapture);
    });
  };

  utils.addMultipleListeners = addMultipleListeners;

  if (typeof window !== "undefined") {
    window.utils = utils;
  }
})();

export { addMultipleListeners };
export default utils;
