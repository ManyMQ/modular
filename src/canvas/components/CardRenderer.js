'use strict';

/**
 * CardRenderer — slim dispatcher.
 * Reads `options.cardType` and delegates rendering to the appropriate card renderer.
 * All drawing logic lives in `../renderers/<CardType>CardRenderer.js`.
 */

const { RankCardRenderer } = require('../renderers/RankCardRenderer');
const { MusicCardRenderer } = require('../renderers/MusicCardRenderer');
const { LeaderboardCardRenderer } = require('../renderers/LeaderboardCardRenderer');
const { InviteCardRenderer } = require('../renderers/InviteCardRenderer');
const { ProfileCardRenderer } = require('../renderers/ProfileCardRenderer');
const { WelcomeCardRenderer } = require('../renderers/WelcomeCardRenderer');

const RENDERERS = {
  rank: RankCardRenderer,
  music: MusicCardRenderer,
  leaderboard: LeaderboardCardRenderer,
  invite: InviteCardRenderer,
  profile: ProfileCardRenderer,
  welcome: WelcomeCardRenderer
};

/**
 * Factory: returns the correct renderer instance for a given cardType.
 * Falls back to RankCardRenderer for unknown types.
 *
 * @param {Object} options
 * @param {string} [options.cardType='rank']
 * @returns {import('../components/BaseComponent').BaseComponent}
 */
function createCardRenderer(options = {}) {
  const RendererClass = RENDERERS[options.cardType] || RankCardRenderer;
  return new RendererClass(options);
}

// Re-export the class map for consumers that need to register or check types
module.exports = { CardRenderer: { createCardRenderer, RENDERERS } };
