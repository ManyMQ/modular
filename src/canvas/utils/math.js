/**
 * Math utilities for layout calculations
 */

/**
 * Clamp a value between min and max
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 * @param {number} a
 * @param {number} b
 * @param {number} t - interpolation factor (0-1)
 * @returns {number}
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Map a value from one range to another
 * @param {number} value
 * @param {number} inMin
 * @param {number} inMax
 * @param {number} outMin
 * @param {number} outMax
 * @returns {number}
 */
function mapRange(value, inMin, inMax, outMin, outMax) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/**
 * Round a number to a specific precision
 * @param {number} value
 * @param {number} decimals
 * @returns {number}
 */
function round(value, decimals = 0) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calculate distance between two points
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if a point is inside a rectangle
 * @param {number} x
 * @param {number} y
 * @param {number} rx
 * @param {number} ry
 * @param {number} rw
 * @param {number} rh
 * @returns {boolean}
 */
function pointInRect(x, y, rx, ry, rw, rh) {
  return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
}

module.exports = {
  clamp,
  lerp,
  mapRange,
  round,
  distance,
  pointInRect
};
