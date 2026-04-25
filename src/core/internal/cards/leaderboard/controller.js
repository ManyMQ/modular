'use strict';

const { normalizeEntry } = require('./service');

function decorate(BuilderClass) {
    const p = BuilderClass.prototype;

    p.setLeaderboard = function setLeaderboard(leaderboard) {
        if (!leaderboard) return this;
        this.setData({
            title: leaderboard.title || 'Leaderboard',
            subtitle: leaderboard.subtitle || 'Top Players',
            season: leaderboard.season,
            entries: leaderboard.entries || []
        });
        return this;
    };

    p.setSeason = function setSeason(season) {
        this.setData({ season: String(season) });
        return this;
    };

    p.setEntries = function setEntries(entries) {
        if (!Array.isArray(entries)) return this;
        this.setData({ entries: entries.map((e, i) => normalizeEntry(e, i + 1)) });
        return this;
    };

    p.addEntry = function addEntry(entry) {
        const entries = this.config.data.entries || [];
        entries.push(normalizeEntry(entry, entries.length + 1));
        this.setData({ entries });
        return this;
    };

    p.fromArray = function fromArray(data) {
        if (!Array.isArray(data)) return this;
        const processed = data.map((item, index) => ({
            username: item.username || item.name || 'Unknown',
            score: Number(item.score || item.xp || item.points || 0),
            level: Number(item.level) || 1,
            avatar: item.avatar || item.avatarURL,
            rank: index + 1
        }));
        this.setData({ entries: processed });
        return this;
    };

    p.sortByScore = function sortByScore(order = 'desc') {
        const entries = this.config.data.entries || [];
        entries.sort((a, b) => order === 'desc' ? b.score - a.score : a.score - b.score);
        entries.forEach((e, i) => { e.rank = i + 1; });
        this.setData({ entries });
        return this;
    };

    p.limit = function limit(count) {
        const entries = (this.config.data.entries || []).slice(0, count);
        this.setData({ entries });
        return this;
    };
}

module.exports = { decorate };

