/**
 * BufferManager - Handles buffer encoding and output
 * @module BufferManager
 */

'use strict';

/**
 * BufferManager - Manages canvas buffer encoding and output
 */
class BufferManager {
  /**
   * Encode canvas to buffer
   * @param {Canvas} canvas - Canvas to encode
   * @param {Object} [options={}] - Encoding options
   * @param {string} [options.format='png'] - Output format
   * @param {number} [options.quality=0.92] - Quality for lossy formats
   * @returns {Promise<Buffer>}
   */
  async encode(canvas, options = {}) {
    const { format = 'png', quality = 0.92 } = options;

    switch (format.toLowerCase()) {
      case 'png':
        return this._encodePng(canvas);
      case 'jpeg':
      case 'jpg':
        return this._encodeJpeg(canvas, quality);
      case 'webp':
        return this._encodeWebP(canvas, quality);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Encode to PNG format
   * @private
   * @param {Canvas} canvas
   * @returns {Promise<Buffer>}
   */
  async _encodePng(canvas) {
    try {
      const { encode } = require('@napi-rs/canvas');
      return await encode(canvas, 'png');
    } catch (err) {
      throw new Error(`PNG encoding failed: ${err.message}`);
    }
  }

  /**
   * Encode to JPEG format
   * @private
   * @param {Canvas} canvas
   * @param {number} quality
   * @returns {Promise<Buffer>}
   */
  async _encodeJpeg(canvas, quality) {
    try {
      const { encode } = require('@napi-rs/canvas');
      return await encode(canvas, 'jpeg', { quality: Math.round(quality * 100) });
    } catch (err) {
      throw new Error(`JPEG encoding failed: ${err.message}`);
    }
  }

  /**
   * Encode to WebP format
   * @private
   * @param {Canvas} canvas
   * @param {number} quality
   * @returns {Promise<Buffer>}
   */
  async _encodeWebP(canvas, quality) {
    try {
      const { encode } = require('@napi-rs/canvas');
      return await encode(canvas, 'webp', { quality: Math.round(quality * 100) });
    } catch (err) {
      throw new Error(`WebP encoding failed: ${err.message}`);
    }
  }

  /**
   * Get file extension for format
   * @param {string} format
   * @returns {string}
   */
  getExtension(format) {
    const extensions = {
      png: 'png',
      jpeg: 'jpg',
      jpg: 'jpg',
      webp: 'webp'
    };
    return extensions[format.toLowerCase()] || 'png';
  }

  /**
   * Get MIME type for format
   * @param {string} format
   * @returns {string}
   */
  getMimeType(format) {
    const mimeTypes = {
      png: 'image/png',
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      webp: 'image/webp'
    };
    return mimeTypes[format.toLowerCase()] || 'image/png';
  }
}

module.exports = { BufferManager };
