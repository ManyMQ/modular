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
   * @param {number} [options.quality=0.92] - Quality for lossy formats (0-1)
   * @returns {Promise<Buffer>}
   */
  async encode(canvas, options = {}) {
    const { format = 'png', quality = 0.92 } = options;

    if (!canvas) {
      throw new Error('BufferManager.encode: canvas is required');
    }

    switch (format.toLowerCase()) {
      case 'png':
        return this._encodePng(canvas);
      case 'jpeg':
      case 'jpg':
        return this._encodeJpeg(canvas, quality);
      case 'webp':
        return this._encodeWebP(canvas, quality);
      default:
        throw new Error(`Unsupported format: ${format}. Supported formats: png, jpeg, webp`);
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
      // @napi-rs/canvas uses canvas.toBuffer('image/png') or canvas.encode('png')
      if (typeof canvas.encode === 'function') {
        return await canvas.encode('png');
      }
      if (typeof canvas.toBuffer === 'function') {
        return canvas.toBuffer('image/png');
      }
      throw new Error('Canvas does not support encode() or toBuffer()');
    } catch (err) {
      if (err.message.includes('Canvas does not support')) throw err;
      throw new Error(`PNG encoding failed: ${err.message}`);
    }
  }

  /**
   * Encode to JPEG format
   * @private
   * @param {Canvas} canvas
   * @param {number} quality - Quality 0-1
   * @returns {Promise<Buffer>}
   */
  async _encodeJpeg(canvas, quality) {
    try {
      if (typeof canvas.encode === 'function') {
        return await canvas.encode('jpeg', Math.round(quality * 100));
      }
      if (typeof canvas.toBuffer === 'function') {
        return canvas.toBuffer('image/jpeg', { quality });
      }
      throw new Error('Canvas does not support encode() or toBuffer()');
    } catch (err) {
      if (err.message.includes('Canvas does not support')) throw err;
      throw new Error(`JPEG encoding failed: ${err.message}`);
    }
  }

  /**
   * Encode to WebP format
   * @private
   * @param {Canvas} canvas
   * @param {number} quality - Quality 0-1
   * @returns {Promise<Buffer>}
   */
  async _encodeWebP(canvas, quality) {
    try {
      if (typeof canvas.encode === 'function') {
        return await canvas.encode('webp', Math.round(quality * 100));
      }
      if (typeof canvas.toBuffer === 'function') {
        return canvas.toBuffer('image/webp', { quality });
      }
      throw new Error('Canvas does not support encode() or toBuffer()');
    } catch (err) {
      if (err.message.includes('Canvas does not support')) throw err;
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
