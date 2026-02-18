/**
 * Basic Profile Card Example
 * Shows how to create a simple user profile card.
 */

const { createEngine } = require('../../index');
const fs = require('fs');
const path = require('path');

async function run() {
    const engine = createEngine();

    const card = await engine.createProfileCard()
        .setUser({
            username: 'BeginnerDev',
            discriminator: '1337',
            avatar: 'https://github.com/manymq.png',
            status: 'online'
        })
        .setData({
            bio: 'Learning how to use canvas rendering in Node.js!',
            joinedDate: 'Jan 2024'
        })
        .render();

    const outputPath = path.join(__dirname, 'profile-basic.png');
    fs.writeFileSync(outputPath, card);
    console.log(`✓ Profile card saved to: ${outputPath}`);
}

run().catch(console.error);
