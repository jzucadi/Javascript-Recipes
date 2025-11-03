// ES6+ version

const utils = {
  /**
   * Checks if 'child' is a descendant of 'parent' using the built-in Node.contains method.
   * @param {HTMLElement|Window} parent 
   * @param {HTMLElement} child 
   * @returns {boolean}
   */
  isDescendant(parent, child) {
    if (!(parent instanceof HTMLElement || parent instanceof Window)) {
      throw new TypeError(`Parent must be an HTMLElement or Window. It is currently a(n) ${typeof parent}`);
    }
    if (!(child instanceof HTMLElement)) {
      throw new TypeError(`Child must be an HTMLElement. It is currently a(n) ${typeof child}`);
    }

    // For Window, perform the check only if both are window objects
    if (parent instanceof Window && child instanceof Window) return parent === child;
    // For elements, use built-in contains
    if (parent instanceof HTMLElement) return parent.contains(child);

    return false;
  }
};

export default utils;
