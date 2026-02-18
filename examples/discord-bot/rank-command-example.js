/**
 * Discord.js Bot Rank Command Example
 * Real-world logic for integrating the card engine into a Discord bot.
 */

const { AttachmentBuilder } = require('discord.js');
const { createEngine } = require('../../index');

// Initialize the engine once in your bot startup
const engine = createEngine();

/**
 * Handle a /rank command
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
async function handleRankCommand(interaction) {
    // 1. Defer reply (rendering might take 50-200ms)
    await interaction.deferReply();

    // 2. Fetch user stats from your database
    const stats = {
        level: 42,
        xp: 2500,
        maxXp: 5000,
        rank: 12
    };

    // 3. Build and render the card
    // Note: builders have a .setUser() method that accepts discord.js User/Member objects!
    const cardBuffer = await engine.createRankCard()
        .setUser(interaction.user)
        .setStats(stats)
        .setTheme('neon-tech') // Select a profile theme
        .render();

    // 4. Create attachment
    const attachment = new AttachmentBuilder(cardBuffer, { name: 'rank-card.png' });

    // 5. Send back to Discord
    await interaction.editReply({
        content: `Here is your rank, ${interaction.user.username}!`,
        files: [attachment]
    });
}

// Note: This file is a template and won't run standalone without a Discord.js client.
console.log('Template loaded. Refer to the comments for Discord.js integration.');
