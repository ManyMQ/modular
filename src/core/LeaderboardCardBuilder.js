/**
 * LeaderboardCardBuilder - Dedicated builder for leaderboard cards
 * @module LeaderboardCardBuilder
 */

'use strict';

const CardBuilder = require('./CardBuilder');

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
    this.config.width = 672;
    this.config.height = 600;
    this.config.layout = this._createLeaderboardLayout();
  }

  /**
   * Create leaderboard card layout
   * @private
   */
  _createLeaderboardLayout() {
    return {
      type: 'leaderboard-card',
      props: { cardType: 'leaderboard' },
      children: [] // Manual rendering in CardRenderer
    };
  }

  /**
   * Set leaderboard data
   * @param {Object} leaderboard - Leaderboard configuration object
   * @param {string} [leaderboard.title] - Card title
   * @param {string} [leaderboard.subtitle] - Card subtitle
   * @param {string} [leaderboard.season] - Season identifier string
   * @param {Array<Object>} [leaderboard.entries] - Array of player entries
   * @returns {LeaderboardCardBuilder} This builder instance for method chaining
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
   * Set card title
   * @param {string} title - Title string
   * @returns {LeaderboardCardBuilder} This builder instance for method chaining
   */
  setTitle(title) {
    this.setData({ title: String(title) });
    return this;
  }

  /**
   * Set card subtitle
   * @param {string} subtitle - Subtitle string
   * @returns {LeaderboardCardBuilder} This builder instance for method chaining
   */
  setSubtitle(subtitle) {
    this.setData({ subtitle: String(subtitle) });
    return this;
  }

  /**
   * Set season badge text
   * @param {string} season - Season name/identifier
   * @returns {LeaderboardCardBuilder} This builder instance for method chaining
   */
  setSeason(season) {
    this.setData({ season: String(season) });
    return this;
  }

  /**
   * Set leaderboard entries
   * @param {Array<Object>} entries - Array of leaderboard entries
   * @returns {LeaderboardCardBuilder} This builder instance for method chaining
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
   * Add a single entry to the leaderboard
   * @param {Object} entry - Entry data
   * @param {string} entry.username - Player username
   * @param {number} entry.score - Player score/XP
   * @param {number} [entry.level=1] - Player level
   * @param {string} [entry.avatar] - Player avatar URL
   * @param {number} [entry.rank] - Player rank
   * @returns {LeaderboardCardBuilder} This builder instance for method chaining
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
   * Set entries from a generic data array
   * @param {Array<Object>} data - Array of data objects
   * @returns {LeaderboardCardBuilder} This builder instance for method chaining
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
   * @param {string} [order='desc'] - Sort order ('asc'|'desc')
   * @returns {LeaderboardCardBuilder} This builder instance for method chaining
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
   * Limit the number of visible entries
   * @param {number} count - Maximum entries to display
   * @returns {LeaderboardCardBuilder} This builder instance for method chaining
   */
  limit(count) {
    const entries = (this.config.data.entries || []).slice(0, count);
    this.setData({ entries });
    return this;
  }

}

module.exports = LeaderboardCardBuilder;
