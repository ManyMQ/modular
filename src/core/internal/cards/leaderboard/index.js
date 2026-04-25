'use strict';

const validation = require('./validation');
const service = require('./service');
const controller = require('./controller');

const LEADERBOARD_CONFIG = Object.freeze({
    id: 'leaderboard',
    preset: 'leaderboard',
    defaultSize: Object.freeze({ width: 672, height: 600 }),
    defaultTheme: 'esport',
    layout: () => ({ type: 'leaderboard-card', props: { cardType: 'leaderboard' }, children: [] }),
    defaultData: Object.freeze({ entries: [] }),
    controller
});

module.exports = {
    CONFIG: LEADERBOARD_CONFIG,
    controller,
    service,
    validation
};

