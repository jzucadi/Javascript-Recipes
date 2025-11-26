// Define the utils interface
interface Utils {
  swapClass: typeof swapClass;
}

// Extend the globalThis interface to include utils
declare global {
  var utils: Utils | undefined;
}

// Create a utils object if it doesn't exist
const utils: Utils = (globalThis. utils ?? (globalThis.utils = {} as Utils)) as Utils;

/**
 * Interface for the return object of swapClass
 */
interface SwapClassReturn {
  forClass(addClass: string): HTMLElement;
}

/**
 * Flip-flops two classes.
 * @param {HTMLElement} el - The HTML element to modify
 * @param {string} removeClass - The class to remove
 * @return {SwapClassReturn} Object with forClass method for chaining
 *
 * Usage:
 * utils.swapClass(document.getElementById('some-element')!, 'class1').forClass('class2');
 */
function swapClass(el: HTMLElement, removeClass: string): SwapClassReturn {
  el.classList.remove(removeClass);

  // Chain forClass as a method
  return {
    forClass(addClass: string): HTMLElement {
      el.classList.add(addClass);
      // Optional: Return element for chaining DOM ops
      return el;
    },
  };
}

utils.swapClass = swapClass;

export { swapClass, utils };
