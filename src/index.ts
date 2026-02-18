/**
 * @osn/modular - Production-grade Discord card generation engine
 * @module @osn/modular
 */

import { Engine } from './core/Engine';
import RankCardBuilder from './core/RankCardBuilder';
import ProfileCardBuilder from './core/ProfileCardBuilder';
import MusicCardBuilder from './core/MusicCardBuilder';
import LeaderboardCardBuilder from './core/LeaderboardCardBuilder';
import InviteCardBuilder from './core/InviteCardBuilder';
import WelcomeCardBuilder from './core/WelcomeCardBuilder';

// 1. Core Factory
/**
 * Create a new engine instance.
 * @param options Engine configuration
 */
export function createEngine(options = {}) {
    return new Engine(options);
}

// 2. Simplified Public API (Standalone Builders)
// These allow 'new RankCard()' which uses a default singleton engine internally.

/**
 * RankCard - Standalone builder for Discord rank cards.
 */
export class RankCard extends (RankCardBuilder as any) {
    constructor(engine?: Engine) {
        super(engine);
    }
}

/**
 * ProfileCard - Standalone builder for Discord profile cards.
 */
export class ProfileCard extends (ProfileCardBuilder as any) {
    constructor(engine?: Engine) {
        super(engine);
    }
}

/**
 * MusicCard - Standalone builder for Discord music cards.
 */
export class MusicCard extends (MusicCardBuilder as any) {
    constructor(engine?: Engine) {
        super(engine);
    }
}

/**
 * Leaderboard - Standalone builder for Discord leaderboard cards.
 */
export class Leaderboard extends (LeaderboardCardBuilder as any) {
    constructor(engine?: Engine) {
        super(engine);
    }
}

/**
 * InviteCard - Standalone builder for Discord invite cards.
 */
export class InviteCard extends (InviteCardBuilder as any) {
    constructor(engine?: Engine) {
        super(engine);
    }
}

/**
 * WelcomeCard - Standalone builder for Discord welcome cards.
 */
export class WelcomeCard extends (WelcomeCardBuilder as any) {
    constructor(engine?: Engine) {
        super(engine);
    }
}

// 3. Theme Utility
/**
 * Create a theme configuration object.
 * @param config Theme definition properties
 */
export function createTheme(config: any) {
    return config;
}

// 4. Stable Core Exports
export { Engine };
export {
    RankCardBuilder,
    ProfileCardBuilder,
    MusicCardBuilder,
    LeaderboardCardBuilder,
    InviteCardBuilder,
    WelcomeCardBuilder
};

// 5. Default Themes & Types
export * from './errors/ModularError';
export { cardThemes as themes } from './canvas/themes/index';
