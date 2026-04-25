'use strict';

const validation = require('./validation');
const service = require('./service');
const controller = require('./controller');

const PROFILE_CONFIG = Object.freeze({
    id: 'profile',
    preset: 'profile',
    defaultSize: Object.freeze({ width: 885, height: 303 }),
    defaultTheme: 'glass-modern',
    layout: () => ({ type: 'profile-card', children: [] }),
    defaultData: validation.DEFAULT_PROFILE_CARD_OPTIONS,
    controller
});

module.exports = {
    CONFIG: PROFILE_CONFIG,
    controller,
    service,
    validation
};

