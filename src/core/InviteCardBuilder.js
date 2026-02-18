/**
 * InviteCardBuilder - Dedicated builder for invite tracking cards
 * @module InviteCardBuilder
 */

'use strict';

const CardBuilder = require('./CardBuilder');

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
    this.config.width = 672;
    this.config.height = 400;
    this.config.layout = this._createInviteLayout();
  }

  /**
   * Create invite card layout
   * @private
   */
  _createInviteLayout() {
    return {
      type: 'invite-card',
      props: { cardType: 'invite' },
      children: [] // Manual rendering in CardRenderer
    };
  }

  /**
   * Set user from Discord.js v14 User/GuildMember
   * @param {Object} user - Discord.js user or member object
   * @returns {InviteCardBuilder} This builder instance for method chaining
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
   * @param {Object} invite - Invite statistics object
   * @param {number} [invite.invites] - Total invites
   * @param {number} [invite.valid] - Valid invites
   * @param {number} [invite.rewards] - Rewards earned
   * @param {number} [invite.milestoneProgress] - Progress to next milestone
   * @param {number} [invite.milestoneMax] - Target for milestone
   * @returns {InviteCardBuilder} This builder instance for method chaining
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
   * Set total invites count
   * @param {number} count - Total invites
   * @returns {InviteCardBuilder} This builder instance for method chaining
   */
  setInvites(count) {
    this.setData({ invites: Number(count) || 0 });
    return this;
  }

  /**
   * Set valid invites count
   * @param {number} count - Valid invites
   * @returns {InviteCardBuilder} This builder instance for method chaining
   */
  setValid(count) {
    this.setData({ valid: Number(count) || 0 });
    return this;
  }

  /**
   * Set rewards earned count
   * @param {number} count - Total rewards
   * @returns {InviteCardBuilder} This builder instance for method chaining
   */
  setRewards(count) {
    this.setData({ rewards: Number(count) || 0 });
    return this;
  }

  /**
   * Set milestone progress
   * @param {number} progress - Current progress value
   * @param {number} [max=250] - Maximum target value
   * @returns {InviteCardBuilder} This builder instance for method chaining
   */
  setMilestone(progress, max = 250) {
    this.setData({
      milestoneProgress: Number(progress) || 0,
      milestoneMax: Number(max) || 250
    });
    return this;
  }

  /**
   * Set card subtitle
   * @param {string} subtitle - Subtitle string
   * @returns {InviteCardBuilder} This builder instance for method chaining
   */
  setSubtitle(subtitle) {
    this.setData({ subtitle: String(subtitle) });
    return this;
  }

  /**
   * Add to current invites count
   * @param {number} count - Number of invites to add
   * @returns {InviteCardBuilder} This builder instance for method chaining
   */
  addInvites(count) {
    const current = this.config.data.invites || 0;
    this.setData({ invites: current + Number(count) });
    return this;
  }

  /**
   * Calculate and set milestone from total invites
   * @param {number} totalInvites - Total user invites
   * @param {number} [milestoneSize=250] - Points per reward milestone
   * @returns {InviteCardBuilder} This builder instance for method chaining
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
}

module.exports = InviteCardBuilder;

