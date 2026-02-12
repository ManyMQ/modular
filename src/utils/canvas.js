/**
 * Canvas utilities for rendering operations
 */

'use strict';

/**
 * Create a rounded rectangle path
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} radius
 */
function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Measure text dimensions
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {string} font
 * @returns {{width: number, height: number}}
 */
function measureText(ctx, text, font) {
  ctx.save();
  ctx.font = font;
  const metrics = ctx.measureText(text);
  ctx.restore();
  
  return {
    width: metrics.width,
    height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
  };
}

/**
 * Set font with proper formatting
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} options
 * @param {number} [options.size=16]
 * @param {string} [options.weight='400']
 * @param {string} [options.family='Inter']
 * @param {string} [options.style='normal']
 */
function setFont(ctx, options = {}) {
  const {
    size = 16,
    weight = '400',
    family = 'Inter',
    style = 'normal'
  } = options;
  
  ctx.font = `${style} ${weight} ${size}px "${family}"`;
}

/**
 * Apply shadow settings
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} options
 * @param {string} [options.color='transparent']
 * @param {number} [options.blur=0]
 * @param {number} [options.offsetX=0]
 * @param {number} [options.offsetY=0]
 */
function setShadow(ctx, options = {}) {
  const {
    color = 'transparent',
    blur = 0,
    offsetX = 0,
    offsetY = 0
  } = options;
  
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = offsetX;
  ctx.shadowOffsetY = offsetY;
}

/**
 * Clear shadow settings
 * @param {CanvasRenderingContext2D} ctx
 */
function clearShadow(ctx) {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

/**
 * Create a linear gradient
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {Array<{pos: number, color: string}>} stops
 * @returns {CanvasGradient}
 */
function createLinearGradient(ctx, x1, y1, x2, y2, stops) {
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  stops.forEach(stop => {
    gradient.addColorStop(stop.pos, stop.color);
  });
  return gradient;
}

/**
 * Create a radial gradient
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} r1
 * @param {number} r2
 * @param {Array<{pos: number, color: string}>} stops
 * @returns {CanvasGradient}
 */
function createRadialGradient(ctx, x, y, r1, r2, stops) {
  const gradient = ctx.createRadialGradient(x, y, r1, x, y, r2);
  stops.forEach(stop => {
    gradient.addColorStop(stop.pos, stop.color);
  });
  return gradient;
}

/**
 * Draw a circle
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} radius
 */
function drawCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.closePath();
}

/**
 * Clip to a rounded rectangle
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} radius
 */
function clipRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  roundRect(ctx, x, y, width, height, radius);
  ctx.clip();
}

module.exports = {
  roundRect,
  measureText,
  setFont,
  setShadow,
  clearShadow,
  createLinearGradient,
  createRadialGradient,
  drawCircle,
  clipRoundRect
};
