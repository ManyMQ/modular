'use strict';

/**
 * BaseTheme - Base class for themes
 */
class BaseTheme {
    /**
     * @param {string} name - Theme name
     * @param {Object} tokens - Theme tokens definition
     */
    constructor(name, tokens = {}) {
        this.name = name;
        this.tokens = tokens;
    }

    /**
     * Get a fully resolved token map
     * @returns {Object}
     */
    getTokens() {
        return { ...this.tokens };
    }
}

module.exports = { BaseTheme };
