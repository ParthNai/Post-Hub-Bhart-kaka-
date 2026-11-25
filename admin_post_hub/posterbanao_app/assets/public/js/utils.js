/* ============================================
   PosterBanao — Shared Utilities
   Common helpers used across multiple modules
   ============================================ */

const PBUtils = (() => {
  /**
   * Sanitize a string for use in filenames.
   * Strips special characters, trims, and truncates.
   * @param {string} value - Raw input string
   * @param {string} fallback - Default if value is empty
   * @returns {string} Safe filename part
   */
  function safeFilePart(value, fallback = 'poster') {
    return (value || fallback)
      .toString()
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 40) || fallback;
  }

  /**
   * Clamp a number between min and max.
   * Returns min if value is not a finite number.
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  function clampNumber(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.max(min, Math.min(max, number));
  }

  /**
   * Create a debounced version of a function.
   * @param {Function} fn - Function to debounce
   * @param {number} delayMs - Delay in milliseconds
   * @returns {Function} Debounced function with a .cancel() method
   */
  function debounce(fn, delayMs) {
    let timerId = null;

    function debounced(...args) {
      if (timerId !== null) clearTimeout(timerId);
      timerId = setTimeout(() => {
        timerId = null;
        fn.apply(this, args);
      }, delayMs);
    }

    debounced.cancel = () => {
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
    };

    return debounced;
  }

  /**
   * Escape HTML special characters to prevent XSS.
   * @param {*} value - Value to escape
   * @returns {string} Escaped string
   */
  function escapeHtml(value) {
    return (value ?? '').toString().replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  return {
    safeFilePart,
    clampNumber,
    debounce,
    escapeHtml
  };
})();

window.PBUtils = PBUtils;
