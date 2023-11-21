/**
 *
 * @param {string} key
 * @param {string} value
 * Set local browser storage and dispatch mutateStorage event
 */
export const setStorage = (key, value) => {
  localStorage.setItem(key, value);
  window.dispatchEvent(new Event("mutateStorage"));
};

/**
 *
 * @param {string} key
 * Delete from local browser storage and dispatch mutateStorage event
 */
export const deleteStorage = (key) => {
  localStorage.removeItem(key);
  window.dispatchEvent(new Event("mutateStorage"));
};

/**
 *
 * @param {string} key
 * @returns {string} Value
 * Get from local browser storage by key
 */
export const getStorage = (key) => {
  const value = localStorage.getItem(key);
  return value;
};
