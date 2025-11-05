/*
determine if certain keys are being pressed utility
*/

const utils = globalThis.utils ?? {};

const keyCodes = {
  tab: 9,
  enter: 13,
  esc: 27,
  up: 38,
  down: 40,
};

// Generic key checker factory
const isKey = (expected) => (e) => {
  const key = e.keyCode ?? e.which;
  // Accept both number and string representations
  return key === expected || key === String(expected);
};

utils.keys = Object.fromEntries(
  Object.entries(keyCodes).map(([name, code]) => [name, isKey(code)])
);

export default utils;
