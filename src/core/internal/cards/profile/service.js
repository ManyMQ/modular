'use strict';

const {
    DEFAULT_PROFILE_CARD_OPTIONS,
    normalizeProfileCardOptions
} = require('./validation');

const DISCORD_STATUS_COLORS = Object.freeze({
    online: '#23a55a',
    idle: '#f0b232',
    dnd: '#f23f43',
    offline: '#80848e'
});

const PROFILE_CARD_BACKGROUND_THEMES = Object.freeze({
    1: Object.freeze({ id: 1, name: 'glass', panel: 'rgba(18, 24, 44, 0.62)', panelBorder: 'rgba(136, 162, 255, 0.25)' }),
    2: Object.freeze({ id: 2, name: 'solid', panel: 'rgba(20, 24, 32, 0.96)', panelBorder: 'rgba(74, 84, 108, 0.5)' }),
    3: Object.freeze({ id: 3, name: 'gradient', panel: 'rgba(26, 18, 42, 0.76)', panelBorder: 'rgba(216, 121, 255, 0.3)' })
});

const PROFILE_CARD_BADGES = Object.freeze({
    1: Object.freeze({ id: 1, label: 'PRO', icon: 'award', bg: '#2B1748', fg: '#C084FC', border: '#A855F7', description: 'Professional Member' }),
    2: Object.freeze({ id: 2, label: 'VIP', icon: 'gift', bg: '#2A141E', fg: '#FB7185', border: '#F43F5E', description: 'Very Important Person' }),
    3: Object.freeze({ id: 3, label: 'BOT', icon: 'target', bg: '#102A2A', fg: '#2DD4BF', border: '#14B8A6', description: 'Automated Bot Account' }),
    4: Object.freeze({ id: 4, label: 'EARLY', icon: 'trophy', bg: '#2F2612', fg: '#FBBF24', border: '#F59E0B', description: 'Early Supporter' }),
    5: Object.freeze({ id: 5, label: 'DEV', icon: 'users', bg: '#16263D', fg: '#60A5FA', border: '#3B82F6', description: 'Verified Developer' }),
    6: Object.freeze({ id: 6, label: 'STAFF', icon: 'award', bg: '#1F2C16', fg: '#86EFAC', border: '#22C55E', description: 'Official Staff' }),
    7: Object.freeze({ id: 7, label: 'Nitro', icon: 'gift', isDiscord: true, description: 'Discord Nitro Subscriber' }),
    8: Object.freeze({ id: 8, label: 'HypeSquad', icon: 'target', isDiscord: true, description: 'HypeSquad Events' }),
    9: Object.freeze({ id: 9, label: 'Partner', icon: 'award', isDiscord: true, description: 'Discord Partner' }),
    10: Object.freeze({ id: 10, label: 'Certified Mod', icon: 'award', isDiscord: true, description: 'Certified Moderator' }),
    11: Object.freeze({ id: 11, label: 'Bug Hunter', icon: 'target', isDiscord: true, description: 'Bug Hunter Level 1' }),
    12: Object.freeze({ id: 12, label: 'Active Developer', icon: 'users', isDiscord: true, description: 'Active Developer Badge' })
});

const PROFILE_CARD_AVATARS = Object.freeze({
    1: createAvatarDataUri({ label: 'A1', start: '#60A5FA', end: '#2563EB', accent: '#DBEAFE' }),
    2: createAvatarDataUri({ label: 'A2', start: '#F472B6', end: '#BE185D', accent: '#FCE7F3' }),
    3: createAvatarDataUri({ label: 'A3', start: '#34D399', end: '#047857', accent: '#D1FAE5' }),
    4: createAvatarDataUri({ label: 'A4', start: '#F59E0B', end: '#B45309', accent: '#FEF3C7' })
});

function createAvatarDataUri(config) {
    const svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">',
        '<defs>',
        `<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">`,
        `<stop offset="0%" stop-color="${config.start}"/>`,
        `<stop offset="100%" stop-color="${config.end}"/>`,
        '</linearGradient>',
        '</defs>',
        '<rect width="256" height="256" rx="128" fill="url(#g)"/>',
        `<circle cx="128" cy="96" r="46" fill="${config.accent}" fill-opacity="0.94"/>`,
        `<path d="M64 212c14-38 48-60 64-60s50 22 64 60" fill="${config.accent}" fill-opacity="0.84"/>`,
        `<text x="128" y="236" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="rgba(255,255,255,0.92)">${config.label}</text>`,
        '</svg>'
    ].join('');

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function resolveProfilePhotoSource(profilePhotoId, fallbackSource) {
    if (PROFILE_CARD_AVATARS[profilePhotoId]) {
        return PROFILE_CARD_AVATARS[profilePhotoId];
    }

    return fallbackSource || PROFILE_CARD_AVATARS[1];
}

function resolveBackgroundTheme(backgroundThemeId) {
    return PROFILE_CARD_BACKGROUND_THEMES[backgroundThemeId]
        || PROFILE_CARD_BACKGROUND_THEMES[1];
}

function resolveBadgeDefinitions(badgeIds = []) {
    return badgeIds
        .map(badgeId => PROFILE_CARD_BADGES[badgeId])
        .filter(Boolean);
}

function formatJoinDateLabel(joinDateValue, joinDateOffset, referenceDate = new Date(), locale = 'en') {
    if (joinDateOffset === 3 || !joinDateValue) {
        return null;
    }

    const joinDate = new Date(joinDateValue);
    const now = new Date(referenceDate);
    if (Number.isNaN(joinDate.getTime()) || Number.isNaN(now.getTime())) {
        return null;
    }

    if (joinDateOffset === 2) {
        return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(joinDate);
    }

    const diffMs = Math.max(0, now.getTime() - joinDate.getTime());
    const totalMinutes = Math.floor(diffMs / 60000);
    const totalHours = Math.floor(diffMs / 3600000);
    const totalDays = Math.floor(diffMs / 86400000);

    if (totalDays > 0) {
        return `${totalDays}d ago`;
    }

    if (totalHours > 0) {
        return `${totalHours}h ago`;
    }

    return `${Math.max(1, totalMinutes)}m ago`;
}

function buildProfileInfoRows(data = {}, options = DEFAULT_PROFILE_CARD_OPTIONS) {
    const rows = [];

    const joinLabel = formatJoinDateLabel(
        options.customDate || data.joinDate,
        options.joinDateOffset,
        data.referenceDate,
        options.localDateType
    );

    if (joinLabel) {
        rows.push({ key: 'joinDate', label: 'Join', value: joinLabel });
    }

    rows.push({
        key: 'level',
        label: 'Level',
        value: String(Number.isFinite(data.level) ? data.level : Number(data.level) || 1)
    });

    if (options.infoDisplayFlag >= 2) {
        rows.push({
            key: 'xp',
            label: 'XP',
            value: `${Number(data.xp) || 0}/${Number(data.maxXp) || 1000}`
        });
    }

    if (options.infoDisplayFlag >= 3) {
        rows.push({
            key: 'badges',
            label: 'Badges',
            value: String(resolveBadgeDefinitions(options.badgeIds).length)
        });
    }

    return rows;
}

function getProfileCardControlSchema() {
    return {
        profilePhotoId: { type: 'integer', min: 1, max: 4, default: 1 },
        backgroundThemeId: { type: 'integer', min: 1, max: 3, default: 1 },
        badgeIds: { type: 'integer[]', default: [] },
        joinDateOffset: { type: 'integer', min: 1, max: 3, default: 1 },
        infoDisplayFlag: { type: 'integer', min: 1, max: 3, default: 2 },
        primary_color: { type: 'integer[]', min: 0, max: 255, default: [108, 123, 255] },
        secondary_color: { type: 'integer[]', min: 0, max: 255, default: [183, 194, 255] },
        pattern_intensity: { type: 'integer', min: 0, max: 100, default: 15 },
        blur_amount: { type: 'integer', min: 0, max: 20, default: 12 },
        gradient_angle: { type: 'integer', min: 0, max: 360, default: 135 },
        status: { type: 'string', options: ['online', 'idle', 'dnd', 'offline'], default: 'online' },
        tooltipBadgeId: { type: 'integer', min: 1, max: 12, default: null }
    };
}

module.exports = {
    DISCORD_STATUS_COLORS,
    PROFILE_CARD_BACKGROUND_THEMES,
    PROFILE_CARD_BADGES,
    PROFILE_CARD_AVATARS,
    normalizeProfileCardOptions,
    resolveProfilePhotoSource,
    resolveBackgroundTheme,
    resolveBadgeDefinitions,
    formatJoinDateLabel,
    buildProfileInfoRows,
    getProfileCardControlSchema
};

