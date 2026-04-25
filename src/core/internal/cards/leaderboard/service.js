'use strict';

function normalizeEntry(entry, rankFallback) {
    return {
        username: entry.username || 'Unknown',
        score: Number(entry.score) || 0,
        level: Number(entry.level) || 1,
        avatar: entry.avatar,
        rank: entry.rank || rankFallback
    };
}

module.exports = { normalizeEntry };

