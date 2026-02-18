/**
 * ProfileCardBuilder - Dedicated builder for user profile cards
 * @module ProfileCardBuilder
 */

'use strict';

const CardBuilder = require('./CardBuilder');

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
   * @param {Object} user - Discord.js user or member object
   * @returns {ProfileCardBuilder} This builder instance for method chaining
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
   * @param {Object} stats - Stats object
   * @param {number} [stats.level] - User level
   * @param {number} [stats.xp] - User XP
   * @param {number} [stats.maxXp] - Required XP for next level
   * @param {number} [stats.rank] - User rank
   * @returns {ProfileCardBuilder} This builder instance for method chaining
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
   * Set user level
   * @param {number} level - User level
   * @returns {ProfileCardBuilder} This builder instance for method chaining
   */
  setLevel(level) {
    this.setData({ level: Number(level) || 1 });
    return this;
  }

  /**
   * Set user XP progress
   * @param {number} xp - Current XP
   * @param {number} [maxXp=1000] - Required XP
   * @returns {ProfileCardBuilder} This builder instance for method chaining
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
   * Set user rank
   * @param {number} rank - User rank
   * @returns {ProfileCardBuilder} This builder instance for method chaining
   */
  setRank(rank) {
    this.setData({ rank: Number(rank) || 0 });
    return this;
  }

  /**
   * Set profile banner URL
   * @param {string} url - Banner image URL
   * @returns {ProfileCardBuilder} This builder instance for method chaining
   */
  setBanner(url) {
    this.setData({ banner: String(url) });
    return this;
  }

  /**
   * Set a custom field value
   * @param {string} key - Field identifier
   * @param {*} value - Field value
   * @returns {ProfileCardBuilder} This builder instance for method chaining
   */
  setField(key, value) {
    const fields = this.config.data.fields || {};
    fields[key] = value;
    this.setData({ fields });
    return this;
  }
}

module.exports = ProfileCardBuilder;

