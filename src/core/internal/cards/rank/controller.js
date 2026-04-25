'use strict';

const { normalizeStatus } = require('./validation');
const { computeProgress, normalizeStats } = require('./service');

function decorate(BuilderClass) {
    const p = BuilderClass.prototype;

    p.setDiscriminator = function setDiscriminator(discriminator) {
        this.setData({ discriminator: String(discriminator) });
        return this;
    };

    p.setLevel = function setLevel(level) {
        this.setData({ level: Number(level) || 1 });
        return this;
    };

    p.setRank = function setRank(rank) {
        this.setData({ rank: Number(rank) || 0 });
        return this;
    };

    p.setXP = function setXP(xp, maxXp = 1000) {
        this.setData(computeProgress(xp, maxXp));
        return this;
    };

    p.setXp = function setXp(xp) {
        const currentMax = this.config.data.maxXp || 1000;
        this.setData(computeProgress(xp, currentMax));
        return this;
    };

    p.setMaxXp = function setMaxXp(maxXp) {
        const currentXp = this.config.data.xp || 0;
        this.setData(computeProgress(currentXp, maxXp));
        return this;
    };

    p.setStats = function setStats(stats) {
        const normalized = normalizeStats(stats);
        if (normalized) this.setData(normalized);
        return this;
    };

    p.setStatus = function setStatus(status) {
        this.setData({ status: normalizeStatus(status) });
        return this;
    };

    p.setMessages = function setMessages(count) {
        this.setData({ messages: Number(count) || 0 });
        return this;
    };

    p.setVoiceTime = function setVoiceTime(seconds) {
        this.setData({ voiceTime: Number(seconds) || 0 });
        return this;
    };

    p.setRankLabel = function setRankLabel(label) {
        this.setData({ labels: { ...this.config.data.labels, rank: String(label) } });
        return this;
    };

    p.setLevelLabel = function setLevelLabel(label) {
        this.setData({ labels: { ...this.config.data.labels, level: String(label) } });
        return this;
    };

    p.setXPLabel = function setXPLabel(label) {
        this.setData({ labels: { ...this.config.data.labels, xp: String(label) } });
        return this;
    };

    p.showMessages = function showMessages(visible = true) {
        this.setData({ showMessages: !!visible });
        return this;
    };

    p.showVoice = function showVoice(visible = true) {
        this.setData({ showVoice: !!visible });
        return this;
    };
}

module.exports = { decorate };

