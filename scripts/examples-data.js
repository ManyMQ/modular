function svgDataUri({ label, start, end, accent }) {
    const svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">',
        '<defs>',
        '<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">',
        `<stop offset="0%" stop-color="${start}"/>`,
        `<stop offset="100%" stop-color="${end}"/>`,
        '</linearGradient>',
        '</defs>',
        '<rect width="512" height="512" rx="256" fill="url(#g)"/>',
        `<circle cx="256" cy="200" r="92" fill="${accent}" fill-opacity="0.94"/>`,
        `<path d="M128 432c28-76 96-120 128-120s100 44 128 120" fill="${accent}" fill-opacity="0.84"/>`,
        `<text x="256" y="480" text-anchor="middle" font-family="Arial, sans-serif" font-size="56" font-weight="700" fill="rgba(255,255,255,0.92)">${label}</text>`,
        '</svg>'
    ].join('');
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const avatar = svgDataUri({ label: 'MM', start: '#60A5FA', end: '#2563EB', accent: '#DBEAFE' });
const art = svgDataUri({ label: 'ART', start: '#F472B6', end: '#BE185D', accent: '#FCE7F3' });

module.exports = {
    avatar,
    art,
    examples: {
        rank: {
            username: 'Senior Dev',
            discriminator: '0001',
            avatar,
            level: 42,
            xp: 750,
            maxXp: 1000,
            rank: 1,
            messages: 15420,
            voiceTime: 36000,
            theme: 'cyberpunk'
        },
        profile: {
            customUsername: 'iAsure',
            customTag: '@iasure',
            customSubtitle: 'Discord-Inspired Design!',
            presenceStatus: 'Playing Visual Studio Code',
            rankData: { level: 27, currentXP: 640, requiredXP: 1000, rank: 1, barColor: '#00fbff' },
            customDate: 'Jul 26, 2017',
            profilePhotoId: 2,
            badgeIds: [7, 8, 1, 4],
            badgesFrame: true,
            primary_color: [30, 40, 90],
            secondary_color: [60, 80, 180],
            pattern_intensity: 25,
            blur_amount: 15,
            moreBackgroundBlur: true,
            backgroundBrightness: 80,
            status: 'dnd',
            borderColor: ['#00fbff', '#6366f1'],
            borderAlign: 'to bottom right',
            theme: 'glass-modern'
        },
        music: {
            trackName: 'Cyberpunk Neon Drive 2077',
            artist: 'Synthwave Legend',
            albumArt: art,
            duration: 240,
            currentTime: 115,
            isPlaying: true,
            volume: 0.8,
            theme: 'neon-tech'
        },
        leaderboard: {
            title: 'Global Rankings',
            subtitle: 'Top Players - Season 4',
            season: 'S4',
            entries: [
                { username: 'Faker', level: 99, score: 15400, avatar },
                { username: 'Chovy', level: 95, score: 14200, avatar },
                { username: 'ShowMaker', level: 92, score: 13800, avatar },
                { username: 'Bdd', level: 88, score: 12500, avatar },
                { username: 'Knight', level: 85, score: 11900, avatar }
            ],
            theme: 'esport'
        },
        invite: {
            username: 'Community Manager',
            title: 'VIP Inviter',
            avatar,
            invites: 145,
            valid: 130,
            rewards: 3,
            milestoneMax: 250,
            theme: 'minimal-developer'
        },
        welcome: {
            username: 'New Member',
            avatar,
            welcomeMessage: 'Welcome to the Server!',
            subtitle: 'You are the 1,337th member to join.',
            theme: 'pink-gradient'
        }
    }
};

