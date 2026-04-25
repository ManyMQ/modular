/**
 * @reformlabs/modular - Production-grade Discord card generation engine
 * @module @reformlabs/modular
 */

import { Engine } from './core/Engine';
import type { EngineOptions, CacheOptions, RendererOptions } from './core/EngineOptions';
import RankCardBuilder from './core/RankCardBuilder';
import ProfileCardBuilder from './core/ProfileCardBuilder';
import MusicCardBuilder from './core/MusicCardBuilder';
import LeaderboardCardBuilder from './core/LeaderboardCardBuilder';
import InviteCardBuilder from './core/InviteCardBuilder';
import WelcomeCardBuilder from './core/WelcomeCardBuilder';

export type ProfilePhotoId = 1 | 2 | 3 | 4;
export type BackgroundThemeId = 1 | 2 | 3;
export type ProfileBadgeId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type JoinDateOffset = 1 | 2 | 3;
export type InfoDisplayFlag = 1 | 2 | 3;
export type DiscordStatus = 'online' | 'idle' | 'dnd' | 'offline';

export type BorderColor = string | [string, string] | string[];

export type ProfileRankData = {
    currentXP?: number;
    requiredXP?: number;
    level?: number;
    rank?: number;
    barColor?: string;
};

/**
 * Integer-only controls for the redesigned profile card.
 */
export interface ProfileCardControlOptions {
    profilePhotoId?: ProfilePhotoId;
    backgroundThemeId?: BackgroundThemeId;
    badgeIds?: ProfileBadgeId[];
    joinDateOffset?: JoinDateOffset;
    infoDisplayFlag?: InfoDisplayFlag;
    // New Parametric Background
    primary_color?: [number, number, number];
    secondary_color?: [number, number, number];
    pattern_intensity?: number;
    blur_amount?: number;
    gradient_angle?: number;
    status?: DiscordStatus;
    tooltipBadgeId?: ProfileBadgeId | null;
}

export interface ProfileCardAdvancedOptions {
    customUsername?: string | null;
    customTag?: string | null;
    customSubtitle?: string | null;
    customBadges?: string[];
    customBackground?: string | null;
    overwriteBadges?: boolean;
    badgesFrame?: boolean;
    removeBadges?: boolean;
    removeBorder?: boolean;
    usernameColor?: string;
    tagColor?: string;
    borderColor?: BorderColor;
    borderAlign?: string;
    disableProfileTheme?: boolean;
    presenceStatus?: string | null;
    squareAvatar?: boolean;
    removeAvatarFrame?: boolean;
    rankData?: ProfileRankData | null;
    moreBackgroundBlur?: boolean;
    backgroundBrightness?: number;
    customDate?: Date | string | null;
    localDateType?: string;
}

export type ProfileCardOptions = ProfileCardControlOptions & ProfileCardAdvancedOptions;

// 1. Core Factory
/**
 * Create a new engine instance.
 * @param options Engine configuration
 */
export function createEngine(options: EngineOptions = {}) {
    return new Engine(options);
}

// 2. Simplified Public API (Standalone Builders)

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
export type { EngineOptions, CacheOptions, RendererOptions };
import RenderPipeline = require('./core/RenderPipeline');
import ThemeManagerMod = require('./canvas/themes/ThemeManager');
const ThemeManager = ThemeManagerMod.ThemeManager;
import CardBuilderMod = require('./core/CardBuilder');
const CardBuilder = CardBuilderMod as any;
export { RenderPipeline, ThemeManager, CardBuilder };
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
export { cardThemes as themes, themeToTokens, getAvailableThemes, BaseTheme } from './canvas/themes/index';
