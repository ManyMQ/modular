/**
 * RankCardBuilder - Dedicated builder for rank/level cards
 * @module RankCardBuilder
 */

'use strict';

const CardBuilder = require('./CardBuilder');

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
    this.config.width = 930;
    this.config.height = 280;
    this.config.layout = this._createRankLayout();
  }

  /**
   * Create rank card layout
   * @private
   */
  _createRankLayout() {
    return {
      type: 'rank-card',
      props: { cardType: 'rank' },
      children: [] // Manual rendering in CardRenderer
    };
  }

  /**
   * Set user from Discord.js v14 User/GuildMember
   * @param {Object} user - Discord.js user or member
   * @returns {RankCardBuilder} This builder instance for method chaining
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
   * @param {Object} stats - Stats object
   * @param {number} stats.level - Current level
   * @param {number} stats.rank - Current rank
   * @param {number} stats.xp - Current XP
   * @param {number} stats.maxXp - XP for next level
   * @returns {RankCardBuilder} This builder instance for method chaining
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
   * @param {number} level - Current level
   * @returns {RankCardBuilder} This builder instance for method chaining
   */
  setLevel(level) {
    this.setData({ level: Number(level) || 1 });
    return this;
  }

  /**
   * Set rank
   * @param {number} rank - Current rank
   * @returns {RankCardBuilder} This builder instance for method chaining
   */
  setRank(rank) {
    this.setData({ rank: Number(rank) || 0 });
    return this;
  }

  /**
   * Set XP progress
   * @param {number} xp - Current XP
   * @param {number} [maxXp=1000] - XP required for next level
   * @returns {RankCardBuilder} This builder instance for method chaining
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
   * Alias for setXP
   * @param {number} xp - Current XP
   * @returns {RankCardBuilder} This builder instance for method chaining
   */
  setXp(xp) {
    this.setData({ xp: Number(xp) || 0 });
    const currentMaxXp = this.config.data.maxXp || 1000;
    this.setData({ progress: currentMaxXp > 0 ? (xp / currentMaxXp) * 100 : 0 });
    return this;
  }

  /**
   * Set max XP
   * @param {number} maxXp - XP required for next level
   * @returns {RankCardBuilder} This builder instance for method chaining
   */
  setMaxXp(maxXp) {
    this.setData({ maxXp: Number(maxXp) || 1000 });
    const currentXp = this.config.data.xp || 0;
    this.setData({ progress: maxXp > 0 ? (currentXp / maxXp) * 100 : 0 });
    return this;
  }

  /**
   * Set custom username
   * @param {string} username - Custom username
   * @returns {RankCardBuilder} This builder instance for method chaining
   */
  setUsername(username) {
    this.setData({ username: String(username) });
    return this;
  }

  /**
   * Set discriminator
   * @param {string} discriminator - User discriminator
   * @returns {RankCardBuilder} This builder instance for method chaining
   */
  setDiscriminator(discriminator) {
    this.setData({ discriminator: String(discriminator) });
    return this;
  }

  /**
   * Set avatar URL
   * @param {string} url - Avatar image URL
   * @returns {RankCardBuilder} This builder instance for method chaining
   */
  setAvatar(url) {
    this.setData({ avatar: String(url) });
    return this;
  }

  /**
   * Set online status
   * @param {string} status - online|idle|dnd|offline|streaming
   * @returns {RankCardBuilder} This builder instance for method chaining
   */
  setStatus(status) {
    const validStatuses = ['online', 'idle', 'dnd', 'offline', 'streaming'];
    const statusValue = validStatuses.includes(status) ? status : 'online';
    this.setData({ status: statusValue });
    return this;
  }

  /**
   * Set message count stat
   * @param {number} count - Total messages
   * @returns {RankCardBuilder} This builder instance for method chaining
   */
  setMessages(count) {
    this.setData({ messages: Number(count) || 0 });
    return this;
  }

  /**
   * Set voice chat time stat
   * @param {number} seconds - Total voice seconds
   * @returns {RankCardBuilder} This builder instance for method chaining
   */
  setVoiceTime(seconds) {
    this.setData({ voiceTime: Number(seconds) || 0 });
    return this;
  }

  /**
   * Set custom rank label (default: "Rank")
   * @param {string} label - Custom label string
   * @returns {RankCardBuilder} This builder instance for method chaining
   */
  setRankLabel(label) {
    this.setData({ labels: { ...this.config.data.labels, rank: String(label) } });
    return this;
  }

  /**
   * Set custom level label (default: "Level")
   * @param {string} label - Custom label string
   * @returns {RankCardBuilder} This builder instance for method chaining
   */
  setLevelLabel(label) {
    this.setData({ labels: { ...this.config.data.labels, level: String(label) } });
    return this;
  }

  /**
   * Set custom XP label (default: "Experience")
   * @param {string} label - Custom label string
   * @returns {RankCardBuilder} This builder instance for method chaining
   */
  setXPLabel(label) {
    this.setData({ labels: { ...this.config.data.labels, xp: String(label) } });
    return this;
  }

  /**
   * Toggle message stat visibility
   * @param {boolean} [visible=true] - Visibility state
   * @returns {RankCardBuilder} This builder instance for method chaining
   */
  showMessages(visible = true) {
    this.setData({ showMessages: !!visible });
    return this;
  }

  /**
   * Toggle voice stat visibility
   * @param {boolean} [visible=true] - Visibility state
   * @returns {RankCardBuilder} This builder instance for method chaining
   */
  showVoice(visible = true) {
    this.setData({ showVoice: !!visible });
    return this;
  }
}

module.exports = RankCardBuilder;

