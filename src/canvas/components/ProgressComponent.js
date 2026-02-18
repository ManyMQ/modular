/**
 * ProgressComponent - Renders progress bars
 * @module ProgressComponent
 */

'use strict';

const { BaseComponent } = require('./BaseComponent');

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
    this.roundRectPath(ctx, x, y, width, height, scaledRadius);
    ctx.fill();

    // Draw fill
    if (fillWidth > 0) {
      ctx.fillStyle = fillColor;
      ctx.save();
      ctx.beginPath();
      this.roundRectPath(ctx, x, y, fillWidth, height, scaledRadius);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();

    return { x, y, width, height, progress };
  }
}

module.exports = { ProgressComponent };
