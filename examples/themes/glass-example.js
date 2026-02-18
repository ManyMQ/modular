/**
 * Glass Modern Theme Example
 * Showcases the clean, translucent aesthetic of 'glass-modern'.
 */

const { createEngine } = require('../../index');
const fs = require('fs');
const path = require('path');

async function run() {
    const engine = createEngine();

    const card = await engine.createMusicCard()
        .setTheme('glass-modern')
        .setTrack({
            title: 'Modern Aesthetics',
            artist: 'Designer Duo',
            albumArt: 'https://github.com/manymq.png',
            duration: 240,
            currentTime: 120,
            isPlaying: true
        })
        .render();

    const outputPath = path.join(__dirname, 'glass-modern-preview.png');
    fs.writeFileSync(outputPath, card);
    console.log(`✓ Glass Modern card saved to: ${outputPath}`);
}

run().catch(console.error);
