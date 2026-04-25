'use strict';

const validation = require('./validation');
const service = require('./service');
const controller = require('./controller');

const WELCOME_CONFIG = Object.freeze({
    id: 'welcome',
    preset: 'welcome',
    defaultSize: Object.freeze({ width: 800, height: 400 }),
    defaultTheme: 'pink-gradient',
    layout: () => ({
        type: 'welcome-card',
        children: []
    }),
    defaultData: Object.freeze({}),
    controller
});

module.exports = {
    CONFIG: WELCOME_CONFIG,
    controller,
    service,
    validation
};
