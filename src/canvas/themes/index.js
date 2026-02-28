'use strict';

/**
 * Themes Index — unified entry point for all 21 card themes.
 * Legacy themes live in ./legacy.js; new themes are each a standalone file here.
 */

const { cardThemes: legacyThemes, cardDimensions, flattenTheme } = require('./legacy');
const minimalDeveloper = require('./minimal-developer');
const neonTech = require('./neon-tech');
const glassModern = require('./glass-modern');
const pinkGradient = require('./pink-gradient');
const esport = require('./esport');

const { BaseTheme } = require('./BaseTheme');

/** All 21 themes in a single flat map. */
const cardThemes = {
    ...legacyThemes,
    'minimal-developer': minimalDeveloper,
    'neon-tech': neonTech,
    'glass-modern': glassModern,
    'pink-gradient': pinkGradient,
    'esport': esport
};

/**
 * Convert a theme name or definition object to a flat token map.
 * @param {string|Object} theme
 * @returns {Object}
 */
function themeToTokens(theme) {
    if (typeof theme === 'string') {
        const resolved = cardThemes[theme] || cardThemes.discord;
        return flattenTheme(resolved);
    }
    return flattenTheme(theme);
}

/**
 * Register all default themes onto a ThemeManager instance.
 * @param {import('../themes/ThemeManager').ThemeManager} themeManager
 */
function registerDefaultThemes(themeManager) {
    Object.entries(cardThemes).forEach(([name, theme]) => {
        themeManager.register(name, theme);
    });
}

/**
 * List all available theme IDs with metadata.
 * @returns {{ id: string, name: string, description: string }[]}
 */
function getAvailableThemes() {
    return Object.keys(cardThemes).map(key => ({
        id: key,
        name: cardThemes[key].name,
        description: cardThemes[key].description
    }));
}

module.exports = {
    cardThemes,
    cardDimensions,
    flattenTheme,
    themeToTokens,
    registerDefaultThemes,
    getAvailableThemes,
    BaseTheme
};
