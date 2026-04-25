'use strict';

function normalizeInvite(invite) {
    if (!invite) return null;
    return {
        invites: Number(invite.invites) || 0,
        valid: Number(invite.valid) || 0,
        rewards: Number(invite.rewards) || 0,
        milestoneProgress: Number(invite.milestoneProgress) || 0,
        milestoneMax: Number(invite.milestoneMax) || 250
    };
}

module.exports = { normalizeInvite };

