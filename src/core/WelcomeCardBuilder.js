/**
 * WelcomeCardBuilder - Dedicated builder for welcome cards
 * @module WelcomeCardBuilder
 */

'use strict';

const CardBuilder = require('./CardBuilder');

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
   * @param {Object} user - Discord.js user or member object
   * @returns {WelcomeCardBuilder} This builder instance for method chaining
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
   * Set welcome message text
   * @param {string} message - Welcome message string
   * @returns {WelcomeCardBuilder} This builder instance for method chaining
   */
  setWelcomeMessage(message) {
    this.setData({ welcomeText: String(message) });
    return this;
  }

  /**
   * Set total member count stat
   * @param {number} count - Total members
   * @returns {WelcomeCardBuilder} This builder instance for method chaining
   */
  setMemberCount(count) {
    this.setData({ memberCount: Number(count) || 0 });
    return this;
  }

  /**
   * Increment and set member count
   * @param {number} currentCount - Current member count
   * @returns {WelcomeCardBuilder} This builder instance for method chaining
   */
  incrementMemberCount(currentCount) {
    this.setData({ memberCount: (Number(currentCount) || 0) + 1 });
    return this;
  }

  /**
   * Set guild name text
   * @param {string} name - Guild name string
   * @returns {WelcomeCardBuilder} This builder instance for method chaining
   */
  setGuildName(name) {
    this.setData({ guildName: String(name) });
    return this;
  }

  /**
   * Set user join date
   * @param {Date|number|string} date - Date object or timestamp
   * @returns {WelcomeCardBuilder} This builder instance for method chaining
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
   * Set custom subtitle text
   * @param {string} subtitle - Subtitle string
   * @returns {WelcomeCardBuilder} This builder instance for method chaining
   */
  setSubtitle(subtitle) {
    this.setData({ subtitle: String(subtitle) });
    return this;
  }
}

module.exports = WelcomeCardBuilder;

