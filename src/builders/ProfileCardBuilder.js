/**
 * ProfileCardBuilder - Dedicated builder for user profile cards
 * @module ProfileCardBuilder
 */

'use strict';

const CardBuilder = require('../core/CardBuilder');

/**
 * ProfileCardBuilder - Creates user profile cards
 * @extends CardBuilder
 */
class ProfileCardBuilder extends CardBuilder {
  /**
   * @param {Engine} engine
   */
  constructor(engine) {
    super(engine);
    this.config.preset = 'profile';
    this.config.layout = this._createProfileLayout();
  }

  /**
   * Create profile card layout
   * @private
   */
  _createProfileLayout() {
    return {
      type: 'profile-card',
      children: [
        { type: 'avatar', props: { x: 20, y: 20, size: 100, slot: 'avatar' } },
        { type: 'text', props: { x: 140, y: 50, slot: 'username', style: { fontSize: 24, fontWeight: 'bold' } } },
        { type: 'text', props: { x: 140, y: 80, slot: 'tag', style: { fontSize: 14 } } },
        { type: 'progress', props: { x: 20, y: 150, width: 760, height: 6, slot: 'xp' } },
        { type: 'text', props: { x: 20, y: 175, slot: 'level', style: { fontSize: 12 } } }
      ]
    };
  }

  /**
   * Set user from Discord.js v14 User/GuildMember
   * @param {User|GuildMember} user
   * @returns {ProfileCardBuilder}
   */
  setUser(user) {
    if (!user) return this;

    const avatarUrl = user.displayAvatarURL ? 
      user.displayAvatarURL({ format: 'png', size: 256 }) : 
      user.avatarURL?.({ format: 'png', size: 256 });

    const bannerUrl = user.bannerURL ? 
      user.bannerURL({ format: 'png', size: 512 }) : null;

    this.setData({
      username: user.username || user.displayName,
      discriminator: user.discriminator || user.tag?.split('#')[1] || '0000',
      tag: user.tag || `${user.username}#${user.discriminator || '0000'}`,
      avatar: avatarUrl,
      banner: bannerUrl,
      displayName: user.displayName || user.username
    });

    return this;
  }

  /**
   * Set statistics
   * @param {Object} stats
   * @param {number} [stats.level]
   * @param {number} [stats.xp]
   * @param {number} [stats.maxXp]
   * @param {number} [stats.rank]
   * @returns {ProfileCardBuilder}
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
   * @returns {ProfileCardBuilder}
   */
  setLevel(level) {
    this.setData({ level: Number(level) || 1 });
    return this;
  }

  /**
   * Set XP
   * @param {number} xp - Current XP
   * @param {number} [maxXp] - Required XP
   * @returns {ProfileCardBuilder}
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
   * Set rank
   * @param {number} rank
   * @returns {ProfileCardBuilder}
   */
  setRank(rank) {
    this.setData({ rank: Number(rank) || 0 });
    return this;
  }

  /**
   * Set banner
   * @param {string} url
   * @returns {ProfileCardBuilder}
   */
  setBanner(url) {
    this.setData({ banner: String(url) });
    return this;
  }

  /**
   * Set custom field
   * @param {string} key
   * @param {*} value
   * @returns {ProfileCardBuilder}
   */
  setField(key, value) {
    const fields = this.config.data.fields || {};
    fields[key] = value;
    this.setData({ fields });
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
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'profile.png' });

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
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'profile.png' });

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
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'profile.png' });

    return channel.send({
      files: [attachment],
      allowedMentions: options.allowedMentions || {},
      ...options
    });
  }
}

module.exports = ProfileCardBuilder;
