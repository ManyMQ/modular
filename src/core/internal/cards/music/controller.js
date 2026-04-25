'use strict';

const { formatTime } = require('./service');

function decorate(BuilderClass) {
    const p = BuilderClass.prototype;
    const originalSetTitle = p.setTitle;

    p.setTrack = function setTrack(track) {
        if (!track) return this;

        this.setData({
            trackName: track.title || track.name || 'Unknown Track',
            artist: track.artist || track.author || 'Unknown Artist',
            albumArt: track.thumbnail || track.image || track.albumArt,
            duration: Number(track.duration) || 0,
            currentTime: Number(track.currentTime) || 0,
            isPlaying: track.isPlaying !== undefined ? track.isPlaying : true
        });

        return this;
    };

    p.setTitle = function setTitle(title) {
        this.setData({ trackName: String(title) });
        return this;
    };

    p.setCardTitle = function setCardTitle(title) {
        return originalSetTitle.call(this, title);
    };

    p.setTrackName = function setTrackName(name) {
        this.setData({ trackName: String(name) });
        return this;
    };

    p.setArtist = function setArtist(artist) {
        this.setData({ artist: String(artist) });
        return this;
    };

    p.setAlbumArt = function setAlbumArt(url) {
        this.setData({ albumArt: String(url) });
        return this;
    };

    p.setDuration = function setDuration(duration) {
        this.setData({ duration: Number(duration) || 0 });
        return this;
    };

    p.setCurrentTime = function setCurrentTime(currentTime) {
        this.setData({ currentTime: Number(currentTime) || 0 });
        return this;
    };

    p.setPlaying = function setPlaying(isPlaying) {
        this.setData({ isPlaying: Boolean(isPlaying) });
        return this;
    };

    p.setIsPlaying = function setIsPlaying(isPlaying) {
        this.setData({ isPlaying: Boolean(isPlaying) });
        return this;
    };

    p.setNowPlayingLabel = function setNowPlayingLabel(label = 'NOW PLAYING') {
        this.setData({ nowPlayingLabel: String(label) });
        return this;
    };

    p.setPaused = function setPaused(paused = true) {
        this.setData({ isPlaying: !paused });
        return this;
    };

    p.setVolume = function setVolume(volume) {
        let v = Number(volume) || 0;
        if (v > 1) v = v / 100;
        this.setData({ volume: Math.min(Math.max(v, 0), 1) });
        return this;
    };

    p.setStartTime = function setStartTime(startTime) {
        const ts = startTime instanceof Date ? startTime.getTime() : Number(startTime);
        this.setData({ startTime: ts });
        return this;
    };

    if (typeof BuilderClass.formatTime !== 'function') {
        BuilderClass.formatTime = formatTime;
    }
}

module.exports = { decorate };

