'use strict';

const validation = require('./validation');
const service = require('./service');
const controller = require('./controller');

const RANK_CONFIG = Object.freeze({
    id: 'rank',
    preset: 'rank',
    defaultSize: Object.freeze({ width: 930, height: 280 }),
    defaultTheme: 'discord',
    layout: () => ({ type: 'rank-card', props: { cardType: 'rank' }, children: [] }),
    defaultData: Object.freeze({}),
    controller
});

module.exports = {
    CONFIG: RANK_CONFIG,
    controller,
    service,
    validation
};

