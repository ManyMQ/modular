'use strict';

const VALID_STATUSES = Object.freeze(['online', 'idle', 'dnd', 'offline', 'streaming']);

function normalizeStatus(status) {
    return VALID_STATUSES.includes(status) ? status : 'online';
}

module.exports = {
    VALID_STATUSES,
    normalizeStatus
};

