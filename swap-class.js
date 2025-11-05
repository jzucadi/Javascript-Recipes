// Create a utils object if it doesn't exist
const utils = globalThis.utils ?? (globalThis.utils = {});

/**
 * Flip-flops two classes.
 * @param {HTMLElement} el
 * @param {string} removeClass
 * @return {Object}
 *
 * Usage:
 * utils.swapClass(document.getElementById('some-element'), 'class1').forClass('class2');
 */
function swapClass(el, removeClass) {
  el.classList.remove(removeClass);

  // Chain forClass as a method
  return {
    forClass(addClass) {
      el.classList.add(addClass);
      // Optional: Return element for chaining DOM ops
      return el;
    },
  };
}

utils.swapClass = swapClass;
