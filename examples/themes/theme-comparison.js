/**
 * Theme Comparison Example
 * Generates the same card using different themes to see the visual difference.
 */

const { createEngine, getAvailableThemes } = require('../../index');
const fs = require('fs');
const path = require('path');

async function run() {
    const engine = createEngine();

    // Get list of themes to compare
    const themesToTest = ['discord', 'neon-tech', 'glass-modern', 'pink-gradient', 'esport', 'minimal-developer'];

    console.log('Generating theme comparison previews...');

    for (const themeId of themesToTest) {
        process.stdout.write(`Rendering ${themeId}... `);

        const card = await engine.createRankCard()
            .setUsername('Theme Explorer')
            .setDiscriminator('2026')
            .setAvatar('https://github.com/manymq.png')
            .setLevel(99)
            .setXP(8500, 10000)
            .setTheme(themeId)
            .render();

        const outputPath = path.join(__dirname, `comparison-${themeId}.png`);
        fs.writeFileSync(outputPath, card);
        console.log('Done.');
    }

    console.log('\n✓ All comparison cards saved in examples/themes/');
}

run().catch(console.error);
