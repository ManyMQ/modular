/**
 * ContainerComponent - Base container for grouping components
 * @module ContainerComponent
 */

'use strict';

const { BaseComponent } = require('../base/BaseComponent');

/**
 * ContainerComponent - Groups and layouts child components
 * @extends BaseComponent
 */
class ContainerComponent extends BaseComponent {
  /**
   * @param {Object} [props={}] - Component properties
   */
  constructor(props = {}) {
    super('container', props);
  }

  /**
   * Internal render method
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} bounds - Layout bounds
   * @param {Object} styles - Computed styles
   * @param {Object} tokens - Resolved tokens
   * @returns {Promise<Object>}
   */
  async _render(ctx, bounds, styles, tokens) {
    const { x, y, width, height } = bounds;
    const backgroundColor = this.getProp('backgroundColor', styles?.background?.color);
    const borderColor = this.getProp('borderColor');
    const borderWidth = this.getProp('borderWidth', 0);
    const cornerRadius = this.getProp('cornerRadius', styles?.effects?.borderRadius || 12);

    const dpi = tokens.dpi || tokens['dpi'] || 2;
    const scaledRadius = this.scale(cornerRadius, dpi);

    ctx.save();

    // Draw background
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      this._roundRectPath(ctx, x, y, width, height, scaledRadius);
      ctx.fill();
    }

    // Draw border
    if (borderColor && borderWidth > 0) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = this.scale(borderWidth, dpi);
      this._roundRectPath(ctx, x, y, width, height, scaledRadius);
      ctx.stroke();
    }

    ctx.restore();

    return { x, y, width, height };
  }

  /**
   * Draw rounded rectangle path
   * @private
   */
  _roundRectPath(ctx, x, y, width, height, radius) {
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
}

module.exports = { ContainerComponent };
