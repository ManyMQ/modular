/**
 * Custom Theme Example
 * Demonstrates how to define a brand-new theme from scratch without editing source files.
 */

const { createEngine } = require('../../index');
const fs = require('fs');
const path = require('path');

async function run() {
    const engine = createEngine();

    // 1. Define a custom theme object
    const sunsetTheme = {
        name: 'Sunset Heights',
        colors: {
            surface: {
                primary: '#2d1b2d',   // Deep Purple
                secondary: '#3d2b3d',
                tertiary: '#1a0f1a'
            },
            accent: {
                primary: '#ff7e5f',   // Warm Orange
                secondary: '#feb47b', // Peach
                glow: 'rgba(255, 126, 95, 0.4)'
            },
            text: {
                primary: '#ffffff',
                secondary: '#ffd1c1',
                muted: '#9e7b9e'
            }
        },
        fonts: {
            family: 'Arial, sans-serif'
        },
        radius: {
            card: 30,
            avatar: 15
        },
        effects: {
            glowStrength: 20,
            gradientBorder: true,
            softShadows: true
        }
    };

    // 2. Register the custom theme
    engine.registerTheme('sunset', sunsetTheme);

    // 3. Use it!
    const card = await engine.createRankCard()
        .setTheme('sunset')
        .setUsername('GoldenHour')
        .setAvatar('https://github.com/manymq.png')
        .setLevel(10)
        .setXP(400, 1000)
        .render();

    const outputPath = path.join(__dirname, 'custom-theme-sunset.png');
    fs.writeFileSync(outputPath, card);
    console.log(`✓ Custom theme card saved to: ${outputPath}`);
}

run().catch(console.error);
