'use strict';

function computeProgress(xp, maxXp) {
    const currentXp = Number(xp) || 0;
    const currentMax = Number(maxXp) || 1000;
    return {
        xp: currentXp,
        maxXp: currentMax,
        progress: currentMax > 0 ? (currentXp / currentMax) * 100 : 0
    };
}

function normalizeStats(stats) {
    if (!stats) return null;
    const xp = Number(stats.xp) || 0;
    const maxXp = Number(stats.maxXp) || stats.requiredXP || 1000;
    return {
        level: Number(stats.level) || 1,
        rank: Number(stats.rank) || 0,
        ...computeProgress(xp, maxXp)
    };
}

module.exports = {
    computeProgress,
    normalizeStats
};

