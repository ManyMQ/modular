/**
 * ModularError - Custom error hierarchy for the modular rendering engine
 * Provides typed errors with actionable context for debugging
 * @module ModularError
 */

'use strict';

/**
 * Base error class for all modular engine errors
 * @extends Error
 */
class ModularError extends Error {
    /**
     * @param {string} message - Error message
     * @param {string} code - Machine-readable error code (e.g. 'INVALID_THEME')
     * @param {Object} [context={}] - Additional context for debugging
     */
    constructor(message, code, context = {}) {
        super(message);
        this.name = 'ModularError';
        this.code = code;
        this.context = context;
        Error.captureStackTrace?.(this, this.constructor);
    }

    /**
     * @returns {string}
     */
    toString() {
        return `[${this.code}] ${this.message}`;
    }

    /**
     * @returns {Object}
     */
    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            context: this.context
        };
    }
}

/**
 * Validation error — invalid input to builder/setter methods
 */
class ValidationError extends ModularError {
    constructor(message, context = {}) {
        super(message, 'VALIDATION_ERROR', context);
        this.name = 'ValidationError';
    }
}

/**
 * Render error — failure during the rendering pipeline
 */
class RenderError extends ModularError {
    constructor(message, context = {}) {
        super(message, 'RENDER_ERROR', context);
        this.name = 'RenderError';
    }
}

/**
 * Asset error — failure loading images, fonts, or other assets
 */
class AssetError extends ModularError {
    constructor(message, context = {}) {
        super(message, 'ASSET_ERROR', context);
        this.name = 'AssetError';
    }
}

/**
 * Theme error — missing or invalid theme configuration
 */
class ThemeError extends ModularError {
    constructor(message, context = {}) {
        super(message, 'THEME_ERROR', context);
        this.name = 'ThemeError';
    }
}

/**
 * Plugin error — failure in plugin lifecycle
 */
class PluginError extends ModularError {
    constructor(message, context = {}) {
        super(message, 'PLUGIN_ERROR', context);
        this.name = 'PluginError';
    }
}

/**
 * Component error — failure in component rendering or registration
 */
class ComponentError extends ModularError {
    constructor(message, context = {}) {
        super(message, 'COMPONENT_ERROR', context);
        this.name = 'ComponentError';
    }
}

module.exports = {
    ModularError,
    ValidationError,
    RenderError,
    AssetError,
    ThemeError,
    PluginError,
    ComponentError
};
