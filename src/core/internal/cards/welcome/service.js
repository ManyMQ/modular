'use strict';

function normalizeJoinDate(date) {
    const joinDate = date instanceof Date ? date : new Date(date);
    return {
        joinDate: joinDate.toLocaleDateString(),
        joinTimestamp: joinDate.getTime()
    };
}

module.exports = { normalizeJoinDate };

