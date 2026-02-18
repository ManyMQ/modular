/**
 * Color utilities for parsing and manipulation
 */

'use strict';

/**
 * Parse hex color to RGB array
 * @param {string} hex - Hex color string
 * @returns {number[]|null} - [r, g, b] or null if invalid
 */
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  if (clean.length === 0) return null;
  
  const bigint = parseInt(clean, 16);
  if (isNaN(bigint)) return null;
  
  if (clean.length === 3) {
    const r = (bigint >> 8) & 0xf;
    const g = (bigint >> 4) & 0xf;
    const b = bigint & 0xf;
    return [r * 17, g * 17, b * 17];
  }
  
  if (clean.length === 6) {
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  }
  
  return null;
}

/**
 * Parse RGB/RGBA string to array
 * @param {string} rgb - RGB/RGBA string
 * @returns {number[]|null} - [r, g, b, a] or null if invalid
 */
function rgbToArray(rgb) {
  if (typeof rgb !== 'string') return null;
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;
  
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = match[4] ? parseFloat(match[4]) : 1;
  
  if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) return null;
  
  return [r, g, b, a];
}

/**
 * Convert RGB to hex
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string} - Hex color
 */
function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.round(clamp(n, 0, 255)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Parse any color format to RGBA
 * @param {string} color - Color string
 * @returns {number[]|null} - [r, g, b, a]
 */
function parseColor(color) {
  if (typeof color !== 'string') return null;
  
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    return rgb ? [...rgb, 1] : null;
  }
  
  if (color.startsWith('rgb')) {
    return rgbToArray(color);
  }
  
  // Named colors (basic)
  const namedColors = {
    white: [255, 255, 255, 1],
    black: [0, 0, 0, 1],
    red: [255, 0, 0, 1],
    green: [0, 128, 0, 1],
    blue: [0, 0, 255, 1],
    transparent: [0, 0, 0, 0],
    gray: [128, 128, 128, 1],
    grey: [128, 128, 128, 1]
  };
  
  if (namedColors[color.toLowerCase()]) {
    return namedColors[color.toLowerCase()];
  }
  
  return null;
}

/**
 * Lighten a color
 * @param {string} color - Input color
 * @param {number} amount - Amount (0-1)
 * @returns {string} - Lightened color
 */
function lighten(color, amount) {
  const rgba = parseColor(color);
  if (!rgba) return color;
  
  const [r, g, b, a] = rgba;
  const newR = Math.round(r + (255 - r) * amount);
  const newG = Math.round(g + (255 - g) * amount);
  const newB = Math.round(b + (255 - b) * amount);
  
  return a === 1 ? rgbToHex(newR, newG, newB) : `rgba(${newR}, ${newG}, ${newB}, ${a})`;
}

/**
 * Darken a color
 * @param {string} color - Input color
 * @param {number} amount - Amount (0-1)
 * @returns {string} - Darkened color
 */
function darken(color, amount) {
  const rgba = parseColor(color);
  if (!rgba) return color;
  
  const [r, g, b, a] = rgba;
  const newR = Math.round(r * (1 - amount));
  const newG = Math.round(g * (1 - amount));
  const newB = Math.round(b * (1 - amount));
  
  return a === 1 ? rgbToHex(newR, newG, newB) : `rgba(${newR}, ${newG}, ${newB}, ${a})`;
}

/**
 * Set alpha for a color
 * @param {string} color - Input color
 * @param {number} alpha - Alpha value (0-1)
 * @returns {string} - Color with alpha
 */
function setAlpha(color, alpha) {
  const rgba = parseColor(color);
  if (!rgba) return color;
  
  const [r, g, b] = rgba;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Clamp value between min and max
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

module.exports = {
  hexToRgb,
  rgbToArray,
  rgbToHex,
  parseColor,
  lighten,
  darken,
  setAlpha,
  clamp
};
