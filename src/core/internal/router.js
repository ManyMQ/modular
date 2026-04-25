'use strict';

const { UnifiedCardBuilder } = require('./shared/UnifiedCardBuilder');

const profile = require('./cards/profile');
const rank = require('./cards/rank');
const music = require('./cards/music');
const leaderboard = require('./cards/leaderboard');
const invite = require('./cards/invite');
const welcome = require('./cards/welcome');

const CONFIGS = Object.freeze({
    profile: profile.CONFIG,
    rank: rank.CONFIG,
    music: music.CONFIG,
    leaderboard: leaderboard.CONFIG,
    invite: invite.CONFIG,
    welcome: welcome.CONFIG
});

const BUILDER_CLASS_CACHE = new Map();

function getCardConfig(id) {
    return CONFIGS[String(id)] || null;
}

function getCardBuilderClass(id) {
    const key = String(id);
    const cached = BUILDER_CLASS_CACHE.get(key);
    if (cached) return cached;

    const cfg = getCardConfig(key);
    if (!cfg) return null;

    class TypedCardBuilder extends UnifiedCardBuilder {
        constructor(engine) {
            super(engine, cfg);
        }
    }

    if (cfg.controller && typeof cfg.controller.decorate === 'function') {
        cfg.controller.decorate(TypedCardBuilder);
    }

    BUILDER_CLASS_CACHE.set(key, TypedCardBuilder);
    return TypedCardBuilder;
}

module.exports = {
    CONFIGS,
    getCardConfig,
    getCardBuilderClass
};

