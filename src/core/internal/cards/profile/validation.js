'use strict';

const { ValidationError } = require('../../../../errors/ModularError');

const DEFAULT_PROFILE_CARD_OPTIONS = Object.freeze({
    profilePhotoId: 1,
    backgroundThemeId: 1,
    badgeIds: [],
    joinDateOffset: 1,
    infoDisplayFlag: 2,
    primary_color: [108, 123, 255],
    secondary_color: [183, 194, 255],
    pattern_intensity: 15,
    blur_amount: 12,
    gradient_angle: 135,
    status: 'online',
    tooltipBadgeId: null,

    customUsername: null,
    customTag: null,
    customSubtitle: null,
    customBadges: [],
    customBackground: null,
    overwriteBadges: false,
    badgesFrame: false,
    removeBadges: false,
    removeBorder: false,
    usernameColor: null,
    tagColor: null,
    borderColor: null,
    borderAlign: null,
    disableProfileTheme: false,
    presenceStatus: null,
    squareAvatar: false,
    removeAvatarFrame: false,
    rankData: null,
    moreBackgroundBlur: false,
    backgroundBrightness: 100,
    customDate: null,
    localDateType: 'en'
});

const PROFILE_CARD_INTEGER_RANGES = Object.freeze({
    profilePhotoId: Object.freeze({ min: 1, max: 4, default: 1 }),
    backgroundThemeId: Object.freeze({ min: 1, max: 3, default: 1 }),
    badgeId: Object.freeze({ min: 1, max: 12 }),
    joinDateOffset: Object.freeze({ min: 1, max: 3, default: 1 }),
    infoDisplayFlag: Object.freeze({ min: 1, max: 3, default: 2 }),
    color_channel: Object.freeze({ min: 0, max: 255 }),
    pattern_intensity: Object.freeze({ min: 0, max: 100, default: 15 }),
    blur_amount: Object.freeze({ min: 0, max: 20, default: 12 }),
    gradient_angle: Object.freeze({ min: 0, max: 360, default: 135 }),
    backgroundBrightness: Object.freeze({ min: 1, max: 100, default: 100 })
});

function assertInteger(name, value, range, defaultValue) {
    if (value === undefined || value === null) {
        return defaultValue;
    }

    if (!Number.isInteger(value)) {
        throw new ValidationError(`Invalid ${name}: ${value}. Must be an integer.`, { field: name, value });
    }

    if (value < range.min || value > range.max) {
        throw new ValidationError(
            `Invalid ${name}: ${value}. Must be between ${range.min} and ${range.max}.`,
            { field: name, value, min: range.min, max: range.max }
        );
    }

    return value;
}

function normalizeColorArray(name, colors, defaultValue) {
    if (!colors) return defaultValue;
    if (!Array.isArray(colors) || colors.length !== 3) {
        throw new ValidationError(`Invalid ${name}: must be [R, G, B] array.`, { field: name, value: colors });
    }
    return colors.map((c, i) => assertInteger(`${name}[${i}]`, c, PROFILE_CARD_INTEGER_RANGES.color_channel));
}

function normalizeBadgeIds(badgeIds) {
    if (badgeIds === undefined || badgeIds === null) {
        return [];
    }

    if (!Array.isArray(badgeIds)) {
        throw new ValidationError('Invalid badgeIds. Must be an array of integers.', {
            field: 'badgeIds',
            value: badgeIds
        });
    }

    const normalized = [];
    for (const badgeId of badgeIds) {
        const normalizedId = assertInteger('badgeIds[]', badgeId, PROFILE_CARD_INTEGER_RANGES.badgeId);
        if (!normalized.includes(normalizedId)) {
            normalized.push(normalizedId);
        }
    }

    return normalized;
}

function normalizeProfileCardOptions(options = {}) {
    const defaults = DEFAULT_PROFILE_CARD_OPTIONS;

    return {
        profilePhotoId: assertInteger(
            'profilePhotoId',
            options.profilePhotoId,
            PROFILE_CARD_INTEGER_RANGES.profilePhotoId,
            defaults.profilePhotoId
        ),
        backgroundThemeId: assertInteger(
            'backgroundThemeId',
            options.backgroundThemeId,
            PROFILE_CARD_INTEGER_RANGES.backgroundThemeId,
            defaults.backgroundThemeId
        ),
        badgeIds: normalizeBadgeIds(options.badgeIds),
        joinDateOffset: assertInteger(
            'joinDateOffset',
            options.joinDateOffset,
            PROFILE_CARD_INTEGER_RANGES.joinDateOffset,
            defaults.joinDateOffset
        ),
        infoDisplayFlag: assertInteger(
            'infoDisplayFlag',
            options.infoDisplayFlag,
            PROFILE_CARD_INTEGER_RANGES.infoDisplayFlag,
            defaults.infoDisplayFlag
        ),
        primary_color: normalizeColorArray('primary_color', options.primary_color, defaults.primary_color),
        secondary_color: normalizeColorArray('secondary_color', options.secondary_color, defaults.secondary_color),
        pattern_intensity: assertInteger(
            'pattern_intensity',
            options.pattern_intensity,
            PROFILE_CARD_INTEGER_RANGES.pattern_intensity,
            defaults.pattern_intensity
        ),
        blur_amount: assertInteger(
            'blur_amount',
            options.blur_amount,
            PROFILE_CARD_INTEGER_RANGES.blur_amount,
            defaults.blur_amount
        ),
        gradient_angle: assertInteger(
            'gradient_angle',
            options.gradient_angle,
            PROFILE_CARD_INTEGER_RANGES.gradient_angle,
            defaults.gradient_angle
        ),
        status: ['online', 'idle', 'dnd', 'offline'].includes(options.status) ? options.status : defaults.status,
        tooltipBadgeId: options.tooltipBadgeId !== undefined ? options.tooltipBadgeId : null,

        customUsername: typeof options.customUsername === 'string' ? options.customUsername : defaults.customUsername,
        customTag: typeof options.customTag === 'string' ? options.customTag : defaults.customTag,
        customSubtitle: typeof options.customSubtitle === 'string' ? options.customSubtitle : defaults.customSubtitle,
        customBadges: Array.isArray(options.customBadges) ? options.customBadges : defaults.customBadges,
        customBackground: typeof options.customBackground === 'string' ? options.customBackground : defaults.customBackground,
        overwriteBadges: !!options.overwriteBadges,
        badgesFrame: !!options.badgesFrame,
        removeBadges: !!options.removeBadges,
        removeBorder: !!options.removeBorder,
        usernameColor: typeof options.usernameColor === 'string' ? options.usernameColor : defaults.usernameColor,
        tagColor: typeof options.tagColor === 'string' ? options.tagColor : defaults.tagColor,
        borderColor: (typeof options.borderColor === 'string' || Array.isArray(options.borderColor)) ? options.borderColor : defaults.borderColor,
        borderAlign: typeof options.borderAlign === 'string' ? options.borderAlign : defaults.borderAlign,
        disableProfileTheme: !!options.disableProfileTheme,
        presenceStatus: typeof options.presenceStatus === 'string' ? options.presenceStatus : defaults.presenceStatus,
        squareAvatar: !!options.squareAvatar,
        removeAvatarFrame: !!options.removeAvatarFrame,
        rankData: options.rankData || defaults.rankData,
        moreBackgroundBlur: !!options.moreBackgroundBlur,
        backgroundBrightness: assertInteger(
            'backgroundBrightness',
            options.backgroundBrightness,
            PROFILE_CARD_INTEGER_RANGES.backgroundBrightness,
            defaults.backgroundBrightness
        ),
        customDate: options.customDate || defaults.customDate,
        localDateType: typeof options.localDateType === 'string' ? options.localDateType : defaults.localDateType
    };
}

module.exports = {
    DEFAULT_PROFILE_CARD_OPTIONS,
    PROFILE_CARD_INTEGER_RANGES,
    normalizeProfileCardOptions
};
