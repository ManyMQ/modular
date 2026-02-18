/**
 * Themes Index - Unified entry point for all card themes.
 * Provides the canonical `themeToTokens()` with full theme resolution.
 *
 * @module themes
 */

'use strict';

const { cardThemes: legacyThemes, cardDimensions, flattenTheme } = require('./CardThemes');
const { BaseTheme } = require('./BaseTheme');
const minimalDeveloper = require('./new/minimal-developer');
const neonTech = require('./new/neon-tech');
const glassModern = require('./new/glass-modern');
const pinkGradient = require('./new/pink-gradient');
const esport = require('./new/esport');

/**
 * Unified themes collection.
 * Total 21 themes: 16 legacy + 5 new.
 * @type {Object.<string, Object>}
 */
const cardThemes = {
    ...legacyThemes,
    'minimal-developer': minimalDeveloper,
    'neon-tech': neonTech,
    'glass-modern': glassModern,
    'pink-gradient': pinkGradient,
    'esport': esport
};

/**
 * Convert a theme name or definition to a flat token map.
 * This is the canonical entry point — resolves string names against
 * the full 21-theme collection before flattening.
 *
 * @param {string|Object} theme - Theme name or theme definition object
 * @returns {Object} Flat token map keyed by dot-notation paths
 */
function themeToTokens(theme) {
    if (typeof theme === 'string') {
        const resolved = cardThemes[theme] || cardThemes.discord;
        return flattenTheme(resolved);
    }
    return flattenTheme(theme);
}

/**
 * Register all default themes to a ThemeManager instance.
 * @param {import('./ThemeManager').ThemeManager} themeManager
 */
function registerDefaultThemes(themeManager) {
    Object.entries(cardThemes).forEach(([name, theme]) => {
        themeManager.register(name, theme);
    });
}

/**
 * Get all available theme identifiers with metadata.
 * @returns {Array<{id: string, name: string, description: string}>}
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
