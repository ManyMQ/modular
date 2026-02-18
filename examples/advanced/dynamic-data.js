/**
 * Dynamic Data & Tokens Example
 * Shows how to use dynamic tokens and variables within a card.
 */

const { createEngine } = require('../../index');
const fs = require('fs');
const path = require('path');

async function run() {
    const engine = createEngine();

    const builder = engine.createRankCard()
        .setTheme('discord');

    // Define a dynamic custom token
    builder.setToken('custom.user_color', '#ff00ff');

    const card = await builder
        .setUsername('Dynamic User')
        .setData({
            // These values can be used in the layout/render pass
            customTag: 'BETA TESTER',
            efficiency: '98%'
        })
        .render();

    const outputPath = path.join(__dirname, 'dynamic-data-test.png');
    fs.writeFileSync(outputPath, card);
    console.log(`✓ Dynamic data card saved to: ${outputPath}`);
}

run().catch(console.error);
