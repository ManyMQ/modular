'use strict';

const CardBuilder = require('../../CardBuilder');
const { deepClone } = require('./utils');

class UnifiedCardBuilder extends CardBuilder {
    constructor(engine, config) {
        super(engine);

        if (!config || !config.preset) {
            throw new Error('UnifiedCardBuilder requires a card config with a preset.');
        }

        this._cardConfig = config;

        this.config.preset = config.preset;

        if (config.defaultSize) {
            this.config.width = config.defaultSize.width;
            this.config.height = config.defaultSize.height;
        }

        this.config.layout = typeof config.layout === 'function'
            ? config.layout()
            : (config.layout || this.config.layout);

        if (config.defaultData) {
            this.setData(deepClone(config.defaultData));
        }
    }
}

module.exports = { UnifiedCardBuilder };

