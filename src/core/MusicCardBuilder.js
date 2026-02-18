/**
 * MusicCardBuilder - Dedicated builder for music player cards
 * @module MusicCardBuilder
 */

'use strict';

const CardBuilder = require('./CardBuilder');

/**
 * MusicCardBuilder - Creates music player cards with track info
 * @extends CardBuilder
 */
class MusicCardBuilder extends CardBuilder {
  /**
   * @param {Engine} engine
   */
  constructor(engine) {
    super(engine);
    this.config.preset = 'music';
    this.config.width = 672;
    this.config.height = 240;
    this.config.layout = this._createMusicLayout();
  }

  /**
   * Create music card layout
   * @private
   */
  _createMusicLayout() {
    return {
      type: 'music-card',
      props: { cardType: 'music' },
      children: [] // Manual rendering in CardRenderer
    };
  }

  /**
   * Set track data
   * @param {Object} track - Track metadata object
   * @param {string} track.title - Track title
   * @param {string} [track.artist] - Artist name
   * @param {string} [track.albumArt] - Album art URL
   * @param {number} [track.duration] - Duration in seconds
   * @param {number} [track.currentTime] - Current position in seconds
   * @param {boolean} [track.isPlaying] - Playing state
   * @returns {MusicCardBuilder} This builder instance for method chaining
   */
  setTrack(track) {
    if (!track) return this;

    this.setData({
      trackName: track.title || track.name || 'Unknown Track',
      artist: track.artist || track.author || 'Unknown Artist',
      albumArt: track.thumbnail || track.image || track.albumArt,
      duration: Number(track.duration) || 0,
      currentTime: Number(track.currentTime) || 0,
      isPlaying: track.isPlaying !== undefined ? track.isPlaying : true
    });

    return this;
  }

  /**
   * Set track title
   * @param {string} title - Track title string
   * @returns {MusicCardBuilder} This builder instance for method chaining
   */
  setTitle(title) {
    this.setData({ trackName: String(title) });
    return this;
  }

  /**
   * Set artist name
   * @param {string} artist - Artist name string
   * @returns {MusicCardBuilder} This builder instance for method chaining
   */
  setArtist(artist) {
    this.setData({ artist: String(artist) });
    return this;
  }

  /**
   * Set album art URL
   * @param {string} url - Image URL for album art
   * @returns {MusicCardBuilder} This builder instance for method chaining
   */
  setAlbumArt(url) {
    this.setData({ albumArt: String(url) });
    return this;
  }

  /**
   * Set track duration
   * @param {number} duration - Duration in seconds
   * @returns {MusicCardBuilder} This builder instance for method chaining
   */
  setDuration(duration) {
    this.setData({ duration: Number(duration) || 0 });
    return this;
  }

  /**
   * Set current playback position
   * @param {number} currentTime - Current position in seconds
   * @returns {MusicCardBuilder} This builder instance for method chaining
   */
  setCurrentTime(currentTime) {
    this.setData({ currentTime: Number(currentTime) || 0 });
    return this;
  }

  /**
   * Set playing state
   * @param {boolean} isPlaying - Whether track is playing
   * @returns {MusicCardBuilder} This builder instance for method chaining
   */
  setPlaying(isPlaying) {
    this.setData({ isPlaying: Boolean(isPlaying) });
    return this;
  }

  /**
   * Set "Now Playing" label text
   * @param {string} [label='NOW PLAYING'] - Custom label string
   * @returns {MusicCardBuilder} This builder instance for method chaining
   */
  setNowPlayingLabel(label = 'NOW PLAYING') {
    this.setData({ nowPlayingLabel: String(label) });
    return this;
  }

  /**
   * Set paused state (inverse of setPlaying)
   * @param {boolean} [paused=true] - Whether track is paused
   * @returns {MusicCardBuilder} This builder instance for method chaining
   */
  setPaused(paused = true) {
    this.setData({ isPlaying: !paused });
    return this;
  }

  /**
   * Set volume level
   * @param {number} volume - Volume (0-100 or 0.0-1.0)
   * @returns {MusicCardBuilder} This builder instance for method chaining
   */
  setVolume(volume) {
    // Standardize to 0.0-1.0
    let v = Number(volume) || 0;
    if (v > 1) v = v / 100;
    this.setData({ volume: Math.min(Math.max(v, 0), 1) });
    return this;
  }

  /**
   * Set start time for auto-calculating progress
   * @param {number|Date} startTime - Milliseconds or Date object
   * @returns {MusicCardBuilder} This builder instance for method chaining
   */
  setStartTime(startTime) {
    const ts = startTime instanceof Date ? startTime.getTime() : Number(startTime);
    this.setData({ startTime: ts });
    return this;
  }

  /**
   * Format seconds to MM:SS string
   * @param {number} seconds - Total seconds
   * @returns {string} Formatted time string
   */
  static formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

module.exports = MusicCardBuilder;

