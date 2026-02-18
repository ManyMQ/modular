/**
 * Custom Layout Example
 * Demonstrates how to build a card with a completely custom layout 
 * by bypassing the preset builders.
 */

const { createEngine } = require('../../index');
const fs = require('fs');
const path = require('path');

async function run() {
    const engine = createEngine();

    // 1. Define a custom layout using the JSON DSL
    const layout = {
        type: 'container',
        props: {
            padding: 40,
            gap: 20
        },
        children: [
            {
                type: 'text',
                props: {
                    content: 'CUSTOM LAYOUT',
                    fontSize: 32,
                    fontWeight: 800,
                    color: '{accent.primary}'
                }
            },
            {
                type: 'container',
                props: { direction: 'row', gap: 30 },
                children: [
                    {
                        type: 'avatar',
                        props: { src: 'https://github.com/manymq.png', size: 100 }
                    },
                    {
                        type: 'container',
                        props: { justify: 'center' },
                        children: [
                            {
                                type: 'text',
                                props: { content: 'User Discovery', fontSize: 24 }
                            },
                            {
                                type: 'text',
                                props: { content: 'Exploring the internals of the engine', fontSize: 16, color: '{text.muted}' }
                            }
                        ]
                    }
                ]
            }
        ]
    };

    // 2. Render using the base CardBuilder
    const builder = engine.createCard()
        .setSize(600, 300)
        .setTheme('discord')
        .setLayout(layout);

    const card = await builder.render();

    const outputPath = path.join(__dirname, 'custom-layout-test.png');
    fs.writeFileSync(outputPath, card);
    console.log(`✓ Custom layout card saved to: ${outputPath}`);
}

run().catch(console.error);
