/**
 * Basic Rank Card Example
 * Shows how to create a simple rank card with essential data.
 */

const { RankCard } = require('../../dist/index');
const fs = require('fs');
const path = require('path');

async function run() {
    // 1. Build the card (standalone constructor)
    const card = await new RankCard()
        .setUsername('Senior Dev')
        .setAvatar('https://github.com/manymq.png')
        .setLevel(42)
        .setRank(7)
        .setXP(2500, 5000)
        .render();

    // 3. Save output
    const outputPath = path.join(__dirname, 'rank-basic.png');
    fs.writeFileSync(outputPath, card);
    console.log(`✓ Rank card saved to: ${outputPath}`);
}

run().catch(console.error);
