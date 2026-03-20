const fs = require('fs');
const path = require('path');
const {
    RankCard, ProfileCard, MusicCard, Leaderboard, InviteCard, WelcomeCard
} = require('../dist/index.js');

const outDir = path.join(__dirname, '..', 'docs', 'assets', 'examples');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function generateExamples() {
    console.log('Generating documentation examples...');

    // 1. Rank Card (Theme: cyberpunk)
    console.log('Generating RankCard...');
    const rankBuffer = await new RankCard()
        .setUsername('Senior Dev')
        .setDiscriminator('0001')
        .setAvatar('https://github.com/manymq.png')
        .setLevel(42)
        .setXP(750, 1000)
        .setRank(1)
        .setMessages(15420)
        .setVoiceTime(36000) // 10 hours
        .setTheme('cyberpunk')
        .render();
    fs.writeFileSync(path.join(outDir, 'rank-cyberpunk.png'), rankBuffer);

    // 2. Profile Card (Theme: glass-modern)
    console.log('Generating ProfileCard...');
    const profileBuffer = await new ProfileCard()
        .setUsername('UI Designer')
        .setAvatar('https://github.com/manymq.png')
        .setTitle('Visual Specialist')
        .setTheme('glass-modern')
        .render();
    fs.writeFileSync(path.join(outDir, 'profile-glass-modern.png'), profileBuffer);

    // 3. Music Card (Theme: neon-tech)
    console.log('Generating MusicCard...');
    const musicBuffer = await new MusicCard()
        .setTrackName('Cyberpunk Neon Drive 2077')
        .setArtist('Synthwave Legend')
        .setAlbumArt('https://github.com/manymq.png')
        .setDuration(240)
        .setCurrentTime(115)
        .setIsPlaying(true)
        .setVolume(0.8)
        .setTheme('neon-tech')
        .render();
    fs.writeFileSync(path.join(outDir, 'music-neon-tech.png'), musicBuffer);

    // 4. Leaderboard Card (Theme: esport)
    console.log('Generating Leaderboard...');
    const lbBuffer = await new Leaderboard()
        .setTitle('Global Rankings')
        .setSubtitle('Top Players - Season 4')
        .setSeason('S4')
        .addEntry({ username: 'Faker', level: 99, score: 15400, avatar: 'https://github.com/manymq.png' })
        .addEntry({ username: 'Chovy', level: 95, score: 14200, avatar: 'https://github.com/manymq.png' })
        .addEntry({ username: 'ShowMaker', level: 92, score: 13800, avatar: 'https://github.com/manymq.png' })
        .addEntry({ username: 'Bdd', level: 88, score: 12500, avatar: 'https://github.com/manymq.png' })
        .addEntry({ username: 'Knight', level: 85, score: 11900, avatar: 'https://github.com/manymq.png' })
        .setTheme('esport')
        .render();
    fs.writeFileSync(path.join(outDir, 'leaderboard-esport.png'), lbBuffer);

    // 5. Invite Card (Theme: minimal-developer)
    console.log('Generating InviteCard...');
    const inviteBuffer = await new InviteCard()
        .setUsername('Community Manager')
        .setTitle('VIP Inviter')
        .setAvatar('https://github.com/manymq.png')
        .setInvites(145)
        .setValid(130)
        .setRewards(3)
        .setMilestoneMax(250)
        .setTheme('minimal-developer')
        .render();
    fs.writeFileSync(path.join(outDir, 'invite-minimal-developer.png'), inviteBuffer);

    // 6. Welcome Card (Theme: pink-gradient)
    console.log('Generating WelcomeCard...');
    const welcomeBuffer = await new WelcomeCard()
        .setUsername('New Member')
        .setAvatar('https://github.com/manymq.png')
        .setWelcomeMessage('Welcome to the Server!')
        .setSubtitle('You are the 1,337th member to join.')
        .setTheme('pink-gradient')
        .render();
    fs.writeFileSync(path.join(outDir, 'welcome-pink-gradient.png'), welcomeBuffer);

    console.log('All examples generated successfully in docs/assets/examples/');
}

generateExamples().catch(err => {
    console.error('Failed to generate examples:', err);
    process.exit(1);
});
