/**
 * WelcomeCardBuilder - Dedicated builder for welcome cards
 * @module WelcomeCardBuilder
 */

'use strict';

const CardBuilder = require('../core/CardBuilder');

/**
 * WelcomeCardBuilder - Creates welcome/greeting cards
 * @extends CardBuilder
 */
class WelcomeCardBuilder extends CardBuilder {
  /**
   * @param {Engine} engine
   */
  constructor(engine) {
    super(engine);
    this.config.preset = 'welcome';
    this.config.layout = this._createWelcomeLayout();
  }

  /**
   * Create welcome card layout
   * @private
   */
  _createWelcomeLayout() {
    return {
      type: 'welcome-card',
      children: [
        { type: 'avatar', props: { x: 350, y: 30, size: 80, slot: 'avatar' } },
        { type: 'text', props: { x: 400, y: 130, slot: 'welcome-text', style: { fontSize: 18 } } },
        { type: 'text', props: { x: 400, y: 160, slot: 'username', style: { fontSize: 28, fontWeight: 'bold' } } },
        { type: 'text', props: { x: 400, y: 200, slot: 'member-count', style: { fontSize: 14 } } }
      ]
    };
  }

  /**
   * Set user from Discord.js v14 User/GuildMember
   * @param {User|GuildMember} user
   * @returns {WelcomeCardBuilder}
   */
  setUser(user) {
    if (!user) return this;

    const avatarUrl = user.displayAvatarURL ? 
      user.displayAvatarURL({ format: 'png', size: 256 }) : 
      user.avatarURL?.({ format: 'png', size: 256 });

    this.setData({
      username: user.username || user.displayName,
      avatar: avatarUrl,
      tag: user.tag || `${user.username}#${user.discriminator || '0000'}`
    });

    return this;
  }

  /**
   * Set welcome message
   * @param {string} message
   * @returns {WelcomeCardBuilder}
   */
  setWelcomeMessage(message) {
    this.setData({ welcomeText: String(message) });
    return this;
  }

  /**
   * Set member count
   * @param {number} count
   * @returns {WelcomeCardBuilder}
   */
  setMemberCount(count) {
    this.setData({ memberCount: Number(count) || 0 });
    return this;
  }

  /**
   * Increment and set member count
   * @param {number} currentCount
   * @returns {WelcomeCardBuilder}
   */
  incrementMemberCount(currentCount) {
    this.setData({ memberCount: (Number(currentCount) || 0) + 1 });
    return this;
  }

  /**
   * Set guild name
   * @param {string} name
   * @returns {WelcomeCardBuilder}
   */
  setGuildName(name) {
    this.setData({ guildName: String(name) });
    return this;
  }

  /**
   * Set join date
   * @param {Date} date
   * @returns {WelcomeCardBuilder}
   */
  setJoinDate(date) {
    const joinDate = date instanceof Date ? date : new Date(date);
    this.setData({ 
      joinDate: joinDate.toLocaleDateString(),
      joinTimestamp: joinDate.getTime()
    });
    return this;
  }

  /**
   * Set custom subtitle
   * @param {string} subtitle
   * @returns {WelcomeCardBuilder}
   */
  setSubtitle(subtitle) {
    this.setData({ subtitle: String(subtitle) });
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
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'welcome.png' });

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
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'welcome.png' });

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
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'welcome.png' });

    return channel.send({
      files: [attachment],
      allowedMentions: options.allowedMentions || {},
      ...options
    });
  }
}

module.exports = WelcomeCardBuilder;
