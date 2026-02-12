/**
 * LeaderboardCardBuilder - Dedicated builder for leaderboard cards
 * @module LeaderboardCardBuilder
 */

'use strict';

const CardBuilder = require('../core/CardBuilder');

/**
 * LeaderboardCardBuilder - Creates leaderboard cards with ranked entries
 * @extends CardBuilder
 */
class LeaderboardCardBuilder extends CardBuilder {
  /**
   * @param {Engine} engine
   */
  constructor(engine) {
    super(engine);
    this.config.preset = 'leaderboard';
    this.config.layout = this._createLeaderboardLayout();
  }

  /**
   * Create leaderboard card layout
   * @private
   */
  _createLeaderboardLayout() {
    return {
      type: 'leaderboard-card',
      children: [
        { type: 'text', props: { x: 20, y: 30, slot: 'title', style: { fontSize: 20, fontWeight: 'bold' } } },
        { type: 'text', props: { x: 20, y: 55, slot: 'subtitle', style: { fontSize: 12 } } }
      ]
    };
  }

  /**
   * Set leaderboard data
   * @param {Object} leaderboard
   * @param {string} [leaderboard.title] - Title
   * @param {string} [leaderboard.subtitle] - Subtitle
   * @param {string} [leaderboard.season] - Season identifier
   * @param {Array} [leaderboard.entries] - Array of entries
   * @returns {LeaderboardCardBuilder}
   */
  setLeaderboard(leaderboard) {
    if (!leaderboard) return this;

    this.setData({
      title: leaderboard.title || 'Leaderboard',
      subtitle: leaderboard.subtitle || 'Top Players',
      season: leaderboard.season,
      entries: leaderboard.entries || []
    });

    return this;
  }

  /**
   * Set title
   * @param {string} title
   * @returns {LeaderboardCardBuilder}
   */
  setTitle(title) {
    this.setData({ title: String(title) });
    return this;
  }

  /**
   * Set subtitle
   * @param {string} subtitle
   * @returns {LeaderboardCardBuilder}
   */
  setSubtitle(subtitle) {
    this.setData({ subtitle: String(subtitle) });
    return this;
  }

  /**
   * Set season badge
   * @param {string} season
   * @returns {LeaderboardCardBuilder}
   */
  setSeason(season) {
    this.setData({ season: String(season) });
    return this;
  }

  /**
   * Set entries
   * @param {Array} entries - Array of leaderboard entries
   * @returns {LeaderboardCardBuilder}
   */
  setEntries(entries) {
    if (!Array.isArray(entries)) return this;

    const processed = entries.map((entry, index) => ({
      username: entry.username || 'Unknown',
      score: Number(entry.score) || 0,
      level: Number(entry.level) || 1,
      avatar: entry.avatar,
      rank: entry.rank || (index + 1)
    }));

    this.setData({ entries: processed });
    return this;
  }

  /**
   * Add single entry
   * @param {Object} entry
   * @param {string   * @param {number} entry} entry.username
.score
   * @param {number} [entry.level]
   * @param {string} [entry.avatar]
   * @returns {LeaderboardCardBuilder}
   */
  addEntry(entry) {
    const entries = this.config.data.entries || [];
    entries.push({
      username: entry.username || 'Unknown',
      score: Number(entry.score) || 0,
      level: Number(entry.level) || 1,
      avatar: entry.avatar,
      rank: entry.rank || entries.length + 1
    });

    this.setData({ entries });
    return this;
  }

  /**
   * Set entries from database-like array
   * @param {Array} data - Array with username, score, level properties
   * @returns {LeaderboardCardBuilder}
   */
  fromArray(data) {
    if (!Array.isArray(data)) return this;

    const processed = data.map((item, index) => ({
      username: item.username || item.name || 'Unknown',
      score: Number(item.score || item.xp || item.points || 0),
      level: Number(item.level) || 1,
      avatar: item.avatar || item.avatarURL,
      rank: index + 1
    }));

    this.setData({ entries: processed });
    return this;
  }

  /**
   * Sort entries by score
   * @param {string} [order='desc'] - 'asc' or 'desc'
   * @returns {LeaderboardCardBuilder}
   */
  sortByScore(order = 'desc') {
    const entries = this.config.data.entries || [];
    
    entries.sort((a, b) => {
      return order === 'desc' ? b.score - a.score : a.score - b.score;
    });

    // Update ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    this.setData({ entries });
    return this;
  }

  /**
   * Limit number of entries
   * @param {number} count - Maximum entries to show
   * @returns {LeaderboardCardBuilder}
   */
  limit(count) {
    const entries = (this.config.data.entries || []).slice(0, count);
    this.setData({ entries });
    return this;
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
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'leaderboard.png' });

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
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'leaderboard.png' });

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
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'leaderboard.png' });

    return channel.send({
      files: [attachment],
      allowedMentions: options.allowedMentions || {},
      ...options
    });
  }
}

module.exports = LeaderboardCardBuilder;
