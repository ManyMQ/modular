'use strict';

const { normalizeInvite } = require('./service');

function decorate(BuilderClass) {
    const p = BuilderClass.prototype;

    p.setInvite = function setInvite(invite) {
        const normalized = normalizeInvite(invite);
        if (normalized) this.setData(normalized);
        return this;
    };

    p.setInvites = function setInvites(count) {
        this.setData({ invites: Number(count) || 0 });
        return this;
    };

    p.setValid = function setValid(count) {
        this.setData({ valid: Number(count) || 0 });
        return this;
    };

    p.setRewards = function setRewards(count) {
        this.setData({ rewards: Number(count) || 0 });
        return this;
    };

    p.setMilestone = function setMilestone(progress, max = 250) {
        this.setData({
            milestoneProgress: Number(progress) || 0,
            milestoneMax: Number(max) || 250
        });
        return this;
    };

    p.setMilestoneMax = function setMilestoneMax(max) {
        this.setData({ milestoneMax: Number(max) || 250 });
        return this;
    };

    p.addInvites = function addInvites(count) {
        const current = this.config.data.invites || 0;
        this.setData({ invites: current + Number(count) });
        return this;
    };

    p.calculateMilestone = function calculateMilestone(totalInvites, milestoneSize = 250) {
        const rewards = Math.floor(totalInvites / milestoneSize);
        const progress = totalInvites % milestoneSize;

        this.setData({
            invites: totalInvites,
            rewards,
            milestoneProgress: progress,
            milestoneMax: milestoneSize
        });

        return this;
    };
}

module.exports = { decorate };

