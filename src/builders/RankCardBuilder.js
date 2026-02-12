/**
 * RankCardBuilder - Dedicated builder for rank/level cards
 * @module RankCardBuilder
 */

'use strict';

const CardBuilder = require('../core/CardBuilder');

/**
 * RankCardBuilder - Creates rank cards with level and XP data
 * @extends CardBuilder
 */
class RankCardBuilder extends CardBuilder {
  /**
   * @param {Engine} engine
   */
  constructor(engine) {
    super(engine);
    this.config.preset = 'rank';
    this.config.layout = this._createRankLayout();
  }

  /**
   * Create rank card layout
   * @private
   */
  _createRankLayout() {
    return {
      type: 'rank-card',
      children: [
        { type: 'avatar', props: { x: 20, y: 20, size: 90, slot: 'avatar' } },
        { type: 'text', props: { x: 130, y: 45, slot: 'username', style: { fontSize: 26, fontWeight: 'bold' } } },
        { type: 'text', props: { x: 130, y: 75, slot: 'rank', style: { fontSize: 14 } } },
        { type: 'level-box', props: { x: 620, y: 20, width: 80, height: 50, slot: 'level' } },
        { type: 'progress', props: { x: 130, y: 130, width: 650, height: 8, slot: 'xp' } },
        { type: 'text', props: { x: 130, y: 155, slot: 'xp-text', style: { fontSize: 10 } } }
      ]
    };
  }

  /**
   * Set user from Discord.js v14 User/GuildMember
   * @param {User|GuildMember} user - Discord.js user or member
   * @returns {RankCardBuilder}
   */
  setUser(user) {
    if (!user) return this;

    const avatarUrl = user.displayAvatarURL ? 
      user.displayAvatarURL({ format: 'png', size: 256 }) : 
      user.avatarURL?.({ format: 'png', size: 256 });

    this.setData({
      username: user.username || user.displayName,
      discriminator: user.discriminator || user.tag?.split('#')[1] || '0000',
      tag: user.tag || `${user.username}#${user.discriminator || '0000'}`,
      avatar: avatarUrl,
      status: user.presence?.status || 'online'
    });

    return this;
  }

  /**
   * Set statistics
   * @param {Object} stats
   * @param {number} stats.level - Current level
   * @param {number} stats.rank - Current rank
   * @param {number} stats.xp - Current XP
   * @param {number} stats.maxXp - XP for next level
   * @returns {RankCardBuilder}
   */
  setStats(stats) {
    if (!stats) return this;

    const xp = Number(stats.xp) || 0;
    const maxXp = Number(stats.maxXp) || stats.requiredXP || 1000;

    this.setData({
      level: Number(stats.level) || 1,
      rank: Number(stats.rank) || 0,
      xp,
      maxXp,
      progress: maxXp > 0 ? (xp / maxXp) * 100 : 0
    });

    return this;
  }

  /**
   * Set level
   * @param {number} level
   * @returns {RankCardBuilder}
   */
  setLevel(level) {
    this.setData({ level: Number(level) || 1 });
    return this;
  }

  /**
   * Set rank
   * @param {number} rank
   * @returns {RankCardBuilder}
   */
  setRank(rank) {
    this.setData({ rank: Number(rank) || 0 });
    return this;
  }

  /**
   * Set XP progress
   * @param {number} xp - Current XP
   * @param {number} maxXp - XP required
   * @returns {RankCardBuilder}
   */
  setXP(xp, maxXp = 1000) {
    this.setData({
      xp: Number(xp) || 0,
      maxXp: Number(maxXp) || 1000,
      progress: maxXp > 0 ? (xp / maxXp) * 100 : 0
    });
    return this;
  }

  /**
   * Set custom username
   * @param {string} username
   * @returns {RankCardBuilder}
   */
  setUsername(username) {
    this.setData({ username: String(username) });
    return this;
  }

  /**
   * Set avatar URL
   * @param {string} url
   * @returns {RankCardBuilder}
   */
  setAvatar(url) {
    this.setData({ avatar: String(url) });
    return this;
  }

  /**
   * Set online status
   * @param {string} status - online|idle|dnd|offline|streaming
   * @returns {RankCardBuilder}
   */
  setStatus(status) {
    const validStatuses = ['online', 'idle', 'dnd', 'offline', 'streaming'];
    const statusValue = validStatuses.includes(status) ? status : 'online';
    this.setData({ status: statusValue });
    return this;
  }

  /**
   * Reply with card to Discord.js v14 interaction
   * @param {ChatInputCommandInteraction|ButtonInteraction|StringSelectInteraction} interaction
   * @param {Object} [options] - Reply options
   * @returns {Promise<void>}
   */
  async reply(interaction, options = {}) {
    const { AttachmentBuilder } = require('discord.js');
    const buffer = await this.render();
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'rank.png' });

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
   * Follow up with card (after defer)
   * @param {ChatInputCommandInteraction|ButtonInteraction|StringSelectInteraction} interaction
   * @param {Object} [options]
   * @returns {Promise<void>}
   */
  async followUp(interaction, options = {}) {
    const { AttachmentBuilder } = require('discord.js');
    const buffer = await this.render();
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'rank.png' });

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
    const { AttachmentBuilder, MessageFlags } = require('discord.js');
    const buffer = await this.render();
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'rank.png' });

    return channel.send({
      files: [attachment],
      allowedMentions: options.allowedMentions || {},
      ...options
    });
  }
}

module.exports = RankCardBuilder;
