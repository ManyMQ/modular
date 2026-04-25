'use strict';

const validation = require('./validation');
const service = require('./service');
const controller = require('./controller');

const MUSIC_CONFIG = Object.freeze({
    id: 'music',
    preset: 'music',
    defaultSize: Object.freeze({ width: 672, height: 240 }),
    defaultTheme: 'neon-tech',
    layout: () => ({ type: 'music-card', props: { cardType: 'music' }, children: [] }),
    defaultData: Object.freeze({}),
    controller
});

module.exports = {
    CONFIG: MUSIC_CONFIG,
    controller,
    service,
    validation
};

