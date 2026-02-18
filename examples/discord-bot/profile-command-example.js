/**
 * Discord.js Bot Profile Command Example
 * Integration example using the .reply() helper method provided by the library.
 */

const { createEngine } = require('../../index');

const engine = createEngine();

/**
 * Handle a /profile command
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
async function handleProfileCommand(interaction) {
    // Builders have built-in .reply() and .followUp() helpers for Discord.js!
    // These handle the AttachmentBuilder and editReply/followUp logic for you.

    await engine.createProfileCard()
        .setUser(interaction.user)
        .setTheme('glass-modern')
        .setData({ bio: 'Discord Bot Developer' })
        // One-liner for Discord.js integration:
        .reply(interaction, {
            filename: 'profile.png',
            ephemeral: false
        });
}

console.log('Template loaded. Shows how to use the built-in .reply() helper.');
