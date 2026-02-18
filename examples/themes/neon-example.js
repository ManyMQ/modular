/**
 * Neon Tech Theme Example
 * Showcases the futuristic futuristic vibe of the 'neon-tech' theme.
 */

const { createEngine } = require('../../index');
const fs = require('fs');
const path = require('path');

async function run() {
    const engine = createEngine();

    const card = await engine.createRankCard()
        .setTheme('neon-tech')
        .setUsername('CyberRunner')
        .setAvatar('https://github.com/manymq.png')
        .setStats({
            level: 75,
            rank: 1,
            xp: 4500,
            maxXp: 5000
        })
        .render();

    const outputPath = path.join(__dirname, 'neon-tech-preview.png');
    fs.writeFileSync(outputPath, card);
    console.log(`✓ Neon Tech card saved to: ${outputPath}`);
}

run().catch(console.error);
