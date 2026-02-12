/**
 * InviteCardBuilder - Dedicated builder for invite tracking cards
 * @module InviteCardBuilder
 */

'use strict';

const CardBuilder = require('../core/CardBuilder');

/**
 * InviteCardBuilder - Creates invite tracking cards
 * @extends CardBuilder
 */
class InviteCardBuilder extends CardBuilder {
  /**
   * @param {Engine} engine
   */
  constructor(engine) {
    super(engine);
    this.config.preset = 'invite';
    this.config.layout = this._createInviteLayout();
  }

  /**
   * Create invite card layout
   * @private
   */
  _createInviteLayout() {
    return {
      type: 'invite-card',
      children: [
        { type: 'avatar', props: { x: 20, y: 20, size: 70, slot: 'avatar' } },
        { type: 'text', props: { x: 110, y: 50, slot: 'username', style: { fontSize: 20, fontWeight: 'bold' } } },
        { type: 'text', props: { x: 110, y: 75, slot: 'subtitle', style: { fontSize: 12 } } },
        { type: 'stat-box', props: { x: 20, y: 120, width: 240, height: 60, slot: 'invites' } },
        { type: 'stat-box', props: { x: 275, y: 120, width: 240, height: 60, slot: 'valid' } },
        { type: 'stat-box', props: { x: 530, y: 120, width: 240, height: 60, slot: 'rewards' } }
      ]
    };
  }

  /**
   * Set user from Discord.js v14 User/GuildMember
   * @param {User|GuildMember} user
   * @returns {InviteCardBuilder}
   */
  setUser(user) {
    if (!user) return this;

    const avatarUrl = user.displayAvatarURL ? 
      user.displayAvatarURL({ format: 'png', size: 128 }) : 
      user.avatarURL?.({ format: 'png', size: 128 });

    this.setData({
      username: user.username || user.displayName,
      avatar: avatarUrl
    });

    return this;
  }

  /**
   * Set invite data
   * @param {Object} invite
   * @param {number} [invite.invites] - Total invites
   * @param {number} [invite.valid] - Valid invites
   * @param {number} [invite.rewards] - Rewards earned
   * @param {number} [invite.milestoneProgress] - Progress to next milestone
   * @param {number} [invite.milestoneMax] - Target for milestone
   * @returns {InviteCardBuilder}
   */
  setInvite(invite) {
    if (!invite) return this;

    this.setData({
      invites: Number(invite.invites) || 0,
      valid: Number(invite.valid) || 0,
      rewards: Number(invite.rewards) || 0,
      milestoneProgress: Number(invite.milestoneProgress) || 0,
      milestoneMax: Number(invite.milestoneMax) || 250
    });

    return this;
  }

  /**
   * Set total invites
   * @param {number} count
   * @returns {InviteCardBuilder}
   */
  setInvites(count) {
    this.setData({ invites: Number(count) || 0 });
    return this;
  }

  /**
   * Set valid invites
   * @param {number} count
   * @returns {InviteCardBuilder}
   */
  setValid(count) {
    this.setData({ valid: Number(count) || 0 });
    return this;
  }

  /**
   * Set rewards
   * @param {number} count
   * @returns {InviteCardBuilder}
   */
  setRewards(count) {
    this.setData({ rewards: Number(count) || 0 });
    return this;
  }

  /**
   * Set milestone progress
   * @param {number} progress - Current progress
   * @param {number} [max] - Target (default: 250)
   * @returns {InviteCardBuilder}
   */
  setMilestone(progress, max = 250) {
    this.setData({
      milestoneProgress: Number(progress) || 0,
      milestoneMax: Number(max) || 250
    });
    return this;
  }

  /**
   * Set subtitle
   * @param {string} subtitle
   * @returns {InviteCardBuilder}
   */
  setSubtitle(subtitle) {
    this.setData({ subtitle: String(subtitle) });
    return this;
  }

  /**
   * Add invites
   * @param {number} count
   * @returns {InviteCardBuilder}
   */
  addInvites(count) {
    const current = this.config.data.invites || 0;
    this.setData({ invites: current + Number(count) });
    return this;
  }

  /**
   * Calculate and set milestone
   * @param {number} totalInvites - Total invites
   * @param {number} [milestoneSize=250] - Points per reward
   * @returns {InviteCardBuilder}
   */
  calculateMilestone(totalInvites, milestoneSize = 250) {
    const rewards = Math.floor(totalInvites / milestoneSize);
    const progress = totalInvites % milestoneSize;

    this.setData({
      invites: totalInvites,
      rewards,
      milestoneProgress: progress,
      milestoneMax: milestoneSize
    });

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
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'invites.png' });

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
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'invites.png' });

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
    const attachment = new AttachmentBuilder(buffer, { name: options.filename || 'invites.png' });

    return channel.send({
      files: [attachment],
      allowedMentions: options.allowedMentions || {},
      ...options
    });
  }
}

module.exports = InviteCardBuilder;
