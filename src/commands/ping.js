const { SlashCommandBuilder } = require('discord.js');
module.exports = {
data: new SlashCommandBuilder().setName('ping').setDescription('Pong test'),
async execute(i) {
i.reply(`Pong: ${Math.round(i.client.ws.ping)}ms`);
}
};
