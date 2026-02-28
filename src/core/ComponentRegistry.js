'use strict';

/**
 * ComponentRegistry - Manages registration and lookup of rendering components.
 * Decoupled from BaseComponent to keep each class focused on a single responsibility.
 */
class ComponentRegistry {
    constructor() {
        this.components = new Map();
    }

    /**
     * Register a component class under a given name.
     * @param {string} name - Unique component identifier
     * @param {Function} ComponentClass - Class to register
     */
    register(name, ComponentClass) {
        if (!name || typeof name !== 'string') {
            throw new Error('Component name must be a non-empty string');
        }
        if (!ComponentClass || typeof ComponentClass !== 'function') {
            throw new Error('ComponentClass must be a function');
        }
        this.components.set(name, ComponentClass);
    }

    /**
     * Retrieve a component class by name.
     * @param {string} name
     * @returns {Function|undefined}
     */
    get(name) {
        return this.components.get(name);
    }

    /**
     * Check if a component type is registered.
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return this.components.has(name);
    }

    /**
     * Create a new instance of a registered component.
     * @param {string} name
     * @param {Object} [props={}]
     * @returns {import('./BaseComponent').BaseComponent}
     */
    create(name, props = {}) {
        const ComponentClass = this.get(name);
        if (!ComponentClass) {
            throw new Error(`Unknown component: "${name}". Register it with engine.registerComponent().`);
        }
        return new ComponentClass(props);
    }

    /**
     * Get all registered component identifiers.
     * @returns {string[]}
     */
    list() {
        return Array.from(this.components.keys());
    }
}

module.exports = { ComponentRegistry };
