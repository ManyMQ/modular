/**
 * MusicCardBuilder - Dedicated builder for music player cards
 * @module MusicCardBuilder
 */

'use strict';

const CardBuilder = require('../core/CardBuilder');

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
    this.config.layout = this._createMusicLayout();
  }

  /**
   * Create music card layout
   * @private
   */
  _createMusicLayout() {
    return {
      type: 'music-card',
      children: [
        { type: 'album-art', props: { x: 20, y: 40, size: 100, slot: 'album' } },
        { type: 'text', props: { x: 140, y: 50, slot: 'label', style: { fontSize: 11 } } },
        { type: 'text', props: { x: 140, y: 78, slot: 'title', style: { fontSize: 22, fontWeight: 'bold' } } },
        { type: 'text', props: { x: 140, y: 105, slot: 'artist', style: { fontSize: 14 } } },
        { type: 'progress', props: { x: 140, y: 155, width: 520, height: 6, slot: 'progress' } },
        { type: 'text', props: { x: 140, y: 180, slot: 'time-current', style: { fontSize: 11 } } },
        { type: 'text', props: { x: 640, y: 180, slot: 'time-total', style: { fontSize: 11 } } }
      ]
    };
  }

  /**
   * Set track data
   * @param {Object} track
   * @param {string} track.title - Track title
   * @param {string} [track.artist] - Artist name
   * @param {string} [track.albumArt] - Album art URL
   * @param {number} [track.duration] - Duration in seconds
   * @param {number} [track.currentTime] - Current position
   * @param {boolean} [track.isPlaying] - Playing state
   * @returns {MusicCardBuilder}
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
   * @param {string} title
   * @returns {MusicCardBuilder}
   */
  setTitle(title) {
    this.setData({ trackName: String(title) });
    return this;
  }

  /**
   * Set artist name
   * @param {string} artist
   * @returns {MusicCardBuilder}
   */
  setArtist(artist) {
    this.setData({ artist: String(artist) });
    return this;
  }

  /**
   * Set album art
   * @param {string} url
   * @returns {MusicCardBuilder}
   */
  setAlbumArt(url) {
    this.setData({ albumArt: String(url) });
    return this;
  }

  /**
   * Set duration
   * @param {number} duration - Duration in seconds
   * @returns {MusicCardBuilder}
   */
  setDuration(duration) {
    this.setData({ duration: Number(duration) || 0 });
    return this;
  }

  /**
   * Set current time
   * @param {number} currentTime - Current position in seconds
   * @returns {MusicCardBuilder}
   */
  setCurrentTime(currentTime) {
    this.setData({ currentTime: Number(currentTime) || 0 });
    return this;
  }

  /**
   * Set playing state
   * @param {boolean} isPlaying
   * @returns {MusicCardBuilder}
   */
  setPlaying(isPlaying) {
    this.setData({ isPlaying: Boolean(isPlaying) });
    return this;
  }

  /**
   * Set "Now Playing" label
   * @param {string} [label]
   * @returns {MusicCardBuilder}
   */
  setNowPlayingLabel(label = 'NOW PLAYING') {
    this.setData({ nowPlayingLabel: String(label) });
    return this;
  }

  /**
   * Format seconds to MM:SS
   * @param {number} seconds
   * @returns {string}
   */
  static formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Reply with card to Discord.js v14 interaction
   * @param {ChatInputCommandInteraction|ButtonInteraction|StringSelectInteraction} interaction
   * @param {Object} [options]
   * @returns {Promise<void>}
   */
  async reply(interaction, options = {}) {
    const { AttachmentBuilder } = require('discord.js');
    const buffer = await this.render();
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'music.png' });

    if (interaction.replied || interaction.deferred) {
      await interaction.editReply({
        files: [attachment],
        ...options
      });
    } else {
      await interaction.reply({
        files: [attachment],
        ephemeral: options.ephemeral || false,
        ...options
      });
    }
  }

  /**
   * Follow up with card
   * @param {ChatInputCommandInteraction|ButtonInteraction|StringSelectInteraction} interaction
   * @param {Object} [options]
   * @returns {Promise<void>}
   */
  async followUp(interaction, options = {}) {
    const { AttachmentBuilder } = require('discord.js');
    const buffer = await this.render();
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'music.png' });

    await interaction.followUp({
      files: [attachment],
      ephemeral: options.ephemeral || false,
      ...options
    });
  }

  /**
   * Send card to channel
   * @param {TextChannel|NewsChannel|DMChannel|ThreadChannel} channel
   * @param {Object} [options]
   * @returns {Promise<Message>}
   */
  async send(channel, options = {}) {
    const { AttachmentBuilder } = require('discord.js');
    const buffer = await this.render();
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'music.png' });

    return channel.send({
      files: [attachment],
      allowedMentions: options.allowedMentions || {},
      ...options
    });
  }
}

module.exports = MusicCardBuilder;
