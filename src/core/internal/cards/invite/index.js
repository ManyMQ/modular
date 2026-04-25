'use strict';

const validation = require('./validation');
const service = require('./service');
const controller = require('./controller');

const INVITE_CONFIG = Object.freeze({
    id: 'invite',
    preset: 'invite',
    defaultSize: Object.freeze({ width: 672, height: 400 }),
    defaultTheme: 'minimal-developer',
    layout: () => ({ type: 'invite-card', props: { cardType: 'invite' }, children: [] }),
    defaultData: Object.freeze({}),
    controller
});

module.exports = {
    CONFIG: INVITE_CONFIG,
    controller,
    service,
    validation
};

