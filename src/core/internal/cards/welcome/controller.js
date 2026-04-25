'use strict';

const { normalizeJoinDate } = require('./service');

function decorate(BuilderClass) {
    const p = BuilderClass.prototype;

    p.setWelcomeMessage = function setWelcomeMessage(message) {
        this.setData({ welcomeMessage: String(message) });
        return this;
    };

    p.setMemberCount = function setMemberCount(count) {
        this.setData({ memberCount: Number(count) || 0 });
        return this;
    };

    p.incrementMemberCount = function incrementMemberCount(currentCount) {
        this.setData({ memberCount: (Number(currentCount) || 0) + 1 });
        return this;
    };

    p.setGuildName = function setGuildName(name) {
        this.setData({ guildName: String(name) });
        return this;
    };

    p.setJoinDate = function setJoinDate(date) {
        this.setData(normalizeJoinDate(date));
        return this;
    };
}

module.exports = { decorate };

