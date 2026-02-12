/**
 * ProgressComponent - Renders progress bars
 * @module ProgressComponent
 */

'use strict';

const { BaseComponent } = require('../base/BaseComponent');

/**
 * ProgressComponent - Renders progress bars with labels
 * @extends BaseComponent
 */
class ProgressComponent extends BaseComponent {
  /**
   * @param {Object} [props={}] - Component properties
   */
  constructor(props = {}) {
    super('progress', props);
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
    const value = this.getProp('value', this.getProp('progress', 0));
    const max = this.getProp('max', 100);
    const showLabel = this.getProp('showLabel', false);
    const labelText = this.getProp('label', '');
    const trackColor = this.getProp('trackColor', styles?.background?.secondary || '#1f1f2e');
    const fillColor = this.getProp('fillColor', styles?.accent?.primary || '#7c3aed');
    const cornerRadius = this.getProp('cornerRadius', height / 2);

    const dpi = tokens.dpi || tokens['dpi'] || 2;
    const scaledHeight = this.scale(height, dpi);
    const scaledRadius = this.scale(cornerRadius, dpi);

    // Calculate progress
    const progress = Math.min(Math.max(value / max, 0), 1);
    const fillWidth = width * progress;

    ctx.save();

    // Draw track
    ctx.fillStyle = trackColor;
    this._roundRectPath(ctx, x, y, width, height, scaledRadius);
    ctx.fill();

    // Draw fill
    if (fillWidth > 0) {
      ctx.fillStyle = fillColor;
      ctx.save();
      ctx.beginPath();
      this._roundRectPath(ctx, x, y, fillWidth, height, scaledRadius);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();

    return { x, y, width, height, progress };
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

module.exports = { ProgressComponent };
