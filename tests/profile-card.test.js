'use strict';

const { ProfileCard } = require('../dist/index');
const crypto = require('node:crypto');
const assert = require('node:assert');

async function testProfileCardRedesign() {
    console.log('Running ProfileCard redesign tests...');

    const baseData = {
        username: 'UI Designer',
        title: 'Visual Specialist',
        level: 27,
        xp: 640,
        maxXp: 1000,
        joinDate: '2026-04-18T10:00:00.000Z',
        referenceDate: '2026-04-25T10:00:00.000Z'
    };

    const cases = [
        {
            name: 'Full Glass with Discord Badges and Parametric BG',
            controls: {
                profilePhotoId: 2,
                backgroundThemeId: 1,
                badgeIds: [7, 8, 1, 4],
                joinDateOffset: 2,
                infoDisplayFlag: 3,
                primary_color: [30, 40, 90],
                secondary_color: [60, 80, 180],
                pattern_intensity: 25,
                blur_amount: 15,
                gradient_angle: 135,
                status: 'online',
                tooltipBadgeId: 7
            },
            expectedHash: 'c3eb547fa69c0f81eecf6d022315cc5c062786de78b193285abc020d0f141a6c'
        },
        {
            name: 'Solid Theme - Level Only - Idle Status',
            controls: {
                profilePhotoId: 3,
                backgroundThemeId: 2,
                badgeIds: [],
                joinDateOffset: 1,
                infoDisplayFlag: 1,
                status: 'idle'
            },
            expectedHash: 'df3f279ad093a0a2bacae6f56068a45583f646834f3d65733625d72c7153089f'
        },
        {
            name: 'Gradient Theme - Hidden Join - DND Status',
            controls: {
                profilePhotoId: 4,
                backgroundThemeId: 3,
                badgeIds: [2, 6],
                joinDateOffset: 3,
                infoDisplayFlag: 2,
                status: 'dnd'
            },
            expectedHash: '65629eeddd64731f15341e897111794809cd70b6ac23282e117f8d3ae435463e'
        }
    ];

    for (const testCase of cases) {
        process.stdout.write(`  Testing case: ${testCase.name}... `);
        
        try {
            const buffer = await new ProfileCard()
                .setUsername(baseData.username)
                .setTitle(baseData.title)
                .setStats({
                    level: baseData.level,
                    xp: baseData.xp,
                    maxXp: baseData.maxXp
                })
                .setJoinDate(baseData.joinDate)
                .setProfileControls(testCase.controls)
                .setData({ referenceDate: baseData.referenceDate })
                .setTheme('glass-modern')
                .render();

            const actualHash = crypto.createHash('sha256').update(buffer).digest('hex');
            
            if (actualHash === testCase.expectedHash) {
                console.log('✅ PASS');
            } else {
                console.log('❌ FAIL');
                console.log(`    Expected: ${testCase.expectedHash}`);
                console.log(`    Actual:   ${actualHash}`);
                process.exit(1);
            }
        } catch (err) {
            console.log('💥 ERROR');
            console.error(err);
            process.exit(1);
        }
    }

    console.log('All ProfileCard redesign tests passed!');
}

if (require.main === module) {
    testProfileCardRedesign().catch(err => {
        console.error(err);
        process.exit(1);
    });
}

module.exports = { testProfileCardRedesign };
