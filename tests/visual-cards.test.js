'use strict';

const crypto = require('node:crypto');
const { RankCard, MusicCard, Leaderboard, InviteCard, WelcomeCard } = require('../dist/index');
const { examples } = require('../scripts/examples-data');

async function testVisualCards() {
    console.log('Running visual regression tests (non-profile cards)...');

    const cases = [
        {
            name: 'RankCard - cyberpunk',
            run: async () => new RankCard()
                .setUsername(examples.rank.username)
                .setDiscriminator(examples.rank.discriminator)
                .setAvatar(examples.rank.avatar)
                .setLevel(examples.rank.level)
                .setXP(examples.rank.xp, examples.rank.maxXp)
                .setRank(examples.rank.rank)
                .setMessages(examples.rank.messages)
                .setVoiceTime(examples.rank.voiceTime)
                .setTheme(examples.rank.theme)
                .render(),
            expectedHash: '0bc01d7a3c7ae3b7288dd0f439ed4656e705b48f94f62b2e1aeb7ba1f8e2c8f7'
        },
        {
            name: 'MusicCard - neon-tech',
            run: async () => new MusicCard()
                .setTrackName(examples.music.trackName)
                .setArtist(examples.music.artist)
                .setAlbumArt(examples.music.albumArt)
                .setDuration(examples.music.duration)
                .setCurrentTime(examples.music.currentTime)
                .setIsPlaying(examples.music.isPlaying)
                .setVolume(examples.music.volume)
                .setTheme(examples.music.theme)
                .render(),
            expectedHash: '101e1da9660f0b36950f545f55c7d87a762ab1a64b92604761bd78eb54b4d198'
        },
        {
            name: 'Leaderboard - esport',
            run: async () => {
                const b = new Leaderboard()
                    .setTitle(examples.leaderboard.title)
                    .setSubtitle(examples.leaderboard.subtitle)
                    .setSeason(examples.leaderboard.season)
                    .setTheme(examples.leaderboard.theme);
                for (const entry of examples.leaderboard.entries) {
                    b.addEntry(entry);
                }
                return b.render();
            },
            expectedHash: 'afd91abf7ab675fd6e0abee7bcaf2e138cd9fd7c092c81bd47f4a68c47103d8f'
        },
        {
            name: 'InviteCard - minimal-developer',
            run: async () => new InviteCard()
                .setUsername(examples.invite.username)
                .setTitle(examples.invite.title)
                .setAvatar(examples.invite.avatar)
                .setInvites(examples.invite.invites)
                .setValid(examples.invite.valid)
                .setRewards(examples.invite.rewards)
                .setMilestoneMax(examples.invite.milestoneMax)
                .setTheme(examples.invite.theme)
                .render(),
            expectedHash: '6e0f7a1619b7699a84075371c9f1b7a26a85f7df2746902aeeb26d640eb20997'
        },
        {
            name: 'WelcomeCard - pink-gradient',
            run: async () => new WelcomeCard()
                .setUsername(examples.welcome.username)
                .setAvatar(examples.welcome.avatar)
                .setWelcomeMessage(examples.welcome.welcomeMessage)
                .setSubtitle(examples.welcome.subtitle)
                .setTheme(examples.welcome.theme)
                .render(),
            expectedHash: '142803a956593ec3ac8e977eb2d0c0db2bc2e2f5f8150a4588cc2a65eb68aaa4'
        }
    ];

    for (const testCase of cases) {
        process.stdout.write(`  Testing case: ${testCase.name}... `);
        const buffer = await testCase.run();
        const actualHash = crypto.createHash('sha256').update(buffer).digest('hex');

        if (actualHash === testCase.expectedHash) {
            console.log('✅ PASS');
        } else {
            console.log('❌ FAIL');
            console.log(`    Expected: ${testCase.expectedHash}`);
            console.log(`    Actual:   ${actualHash}`);
            process.exit(1);
        }
    }

    console.log('All non-profile visual regression tests passed!');
}

if (require.main === module) {
    testVisualCards().catch(err => {
        console.error(err);
        process.exit(1);
    });
}

module.exports = { testVisualCards };
