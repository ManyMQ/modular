'use strict';

const { normalizeProfileCardOptions } = require('./validation');

function getProfileControlState(data) {
    return {
        profilePhotoId: data.profilePhotoId,
        backgroundThemeId: data.backgroundThemeId,
        badgeIds: data.badgeIds,
        joinDateOffset: data.joinDateOffset,
        infoDisplayFlag: data.infoDisplayFlag,
        primary_color: data.primary_color,
        secondary_color: data.secondary_color,
        pattern_intensity: data.pattern_intensity,
        blur_amount: data.blur_amount,
        gradient_angle: data.gradient_angle,
        status: data.status,
        tooltipBadgeId: data.tooltipBadgeId,
        customUsername: data.customUsername,
        customTag: data.customTag,
        customSubtitle: data.customSubtitle,
        customBadges: data.customBadges,
        customBackground: data.customBackground,
        overwriteBadges: data.overwriteBadges,
        badgesFrame: data.badgesFrame,
        removeBadges: data.removeBadges,
        removeBorder: data.removeBorder,
        usernameColor: data.usernameColor,
        tagColor: data.tagColor,
        borderColor: data.borderColor,
        borderAlign: data.borderAlign,
        disableProfileTheme: data.disableProfileTheme,
        presenceStatus: data.presenceStatus,
        squareAvatar: data.squareAvatar,
        removeAvatarFrame: data.removeAvatarFrame,
        rankData: data.rankData,
        moreBackgroundBlur: data.moreBackgroundBlur,
        backgroundBrightness: data.backgroundBrightness,
        customDate: data.customDate,
        localDateType: data.localDateType
    };
}

function decorate(BuilderClass) {
    const p = BuilderClass.prototype;

    p.setProfileControls = function setProfileControls(controls) {
        const nextControls = normalizeProfileCardOptions({
            ...getProfileControlState(this.config.data),
            ...(controls || {})
        });
        this.setData(nextControls);
        return this;
    };

    p.setProfilePhotoId = function setProfilePhotoId(profilePhotoId) {
        return this.setProfileControls({ profilePhotoId });
    };
    p.setBackgroundThemeId = function setBackgroundThemeId(backgroundThemeId) {
        return this.setProfileControls({ backgroundThemeId });
    };
    p.setBadgeIds = function setBadgeIds(badgeIds) {
        return this.setProfileControls({ badgeIds });
    };
    p.setJoinDateOffset = function setJoinDateOffset(joinDateOffset) {
        return this.setProfileControls({ joinDateOffset });
    };
    p.setInfoDisplayFlag = function setInfoDisplayFlag(infoDisplayFlag) {
        return this.setProfileControls({ infoDisplayFlag });
    };

    p.setPrimaryColor = function setPrimaryColor(rgb) {
        return this.setProfileControls({ primary_color: rgb });
    };
    p.setSecondaryColor = function setSecondaryColor(rgb) {
        return this.setProfileControls({ secondary_color: rgb });
    };
    p.setPatternIntensity = function setPatternIntensity(pattern_intensity) {
        return this.setProfileControls({ pattern_intensity });
    };
    p.setBlurAmount = function setBlurAmount(blur_amount) {
        return this.setProfileControls({ blur_amount });
    };
    p.setGradientAngle = function setGradientAngle(gradient_angle) {
        return this.setProfileControls({ gradient_angle });
    };
    p.setStatus = function setStatus(status) {
        return this.setProfileControls({ status });
    };
    p.setTooltipBadgeId = function setTooltipBadgeId(tooltipBadgeId) {
        return this.setProfileControls({ tooltipBadgeId });
    };

    p.setCustomUsername = function setCustomUsername(customUsername) {
        return this.setProfileControls({ customUsername });
    };
    p.setCustomTag = function setCustomTag(customTag) {
        return this.setProfileControls({ customTag });
    };
    p.setCustomSubtitle = function setCustomSubtitle(customSubtitle) {
        return this.setProfileControls({ customSubtitle });
    };
    p.setCustomBadges = function setCustomBadges(customBadges) {
        return this.setProfileControls({ customBadges });
    };
    p.setCustomBackground = function setCustomBackground(customBackground) {
        return this.setProfileControls({ customBackground });
    };
    p.setOverwriteBadges = function setOverwriteBadges(overwriteBadges) {
        return this.setProfileControls({ overwriteBadges });
    };
    p.setBadgesFrame = function setBadgesFrame(badgesFrame) {
        return this.setProfileControls({ badgesFrame });
    };
    p.setRemoveBadges = function setRemoveBadges(removeBadges) {
        return this.setProfileControls({ removeBadges });
    };
    p.setRemoveBorder = function setRemoveBorder(removeBorder) {
        return this.setProfileControls({ removeBorder });
    };
    p.setUsernameColor = function setUsernameColor(usernameColor) {
        return this.setProfileControls({ usernameColor });
    };
    p.setTagColor = function setTagColor(tagColor) {
        return this.setProfileControls({ tagColor });
    };
    p.setBorderColor = function setBorderColor(borderColor) {
        return this.setProfileControls({ borderColor });
    };
    p.setBorderAlign = function setBorderAlign(borderAlign) {
        return this.setProfileControls({ borderAlign });
    };
    p.setDisableProfileTheme = function setDisableProfileTheme(disableProfileTheme) {
        return this.setProfileControls({ disableProfileTheme });
    };
    p.setPresenceStatus = function setPresenceStatus(presenceStatus) {
        return this.setProfileControls({ presenceStatus });
    };
    p.setSquareAvatar = function setSquareAvatar(squareAvatar) {
        return this.setProfileControls({ squareAvatar });
    };
    p.setRemoveAvatarFrame = function setRemoveAvatarFrame(removeAvatarFrame) {
        return this.setProfileControls({ removeAvatarFrame });
    };
    p.setRankData = function setRankData(rankData) {
        return this.setProfileControls({ rankData });
    };
    p.setMoreBackgroundBlur = function setMoreBackgroundBlur(moreBackgroundBlur) {
        return this.setProfileControls({ moreBackgroundBlur });
    };
    p.setBackgroundBrightness = function setBackgroundBrightness(backgroundBrightness) {
        return this.setProfileControls({ backgroundBrightness });
    };
    p.setCustomDate = function setCustomDate(customDate) {
        return this.setProfileControls({ customDate });
    };
    p.setLocalDateType = function setLocalDateType(localDateType) {
        return this.setProfileControls({ localDateType });
    };

    p.setJoinDate = function setJoinDate(joinDate) {
        const normalizedDate = joinDate instanceof Date ? joinDate.toISOString() : String(joinDate);
        this.setData({ joinDate: normalizedDate });
        return this;
    };

    p.setBanner = function setBanner(url) {
        this.setData({ banner: String(url) });
        return this;
    };

    p.setField = function setField(key, value) {
        const fields = this.config.data.fields || {};
        fields[key] = value;
        this.setData({ fields });
        return this;
    };
}

module.exports = { decorate };

