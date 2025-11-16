require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');


const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();


const files = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));
for (const file of files) {
const cmd = require(`./commands/${file}`);
client.commands.set(cmd.data.name, cmd);
}


client.once('ready', () => {
console.log('DraftBot Clone running!');
});


client.on('interactionCreate', async interaction => {
if (!interaction.isChatInputCommand()) return;
const cmd = client.commands.get(interaction.commandName);
if (!cmd) return;


try {
await cmd.execute(interaction, client);
} catch (err) {
console.error(err);
interaction.reply({ content: 'Erreur.', ephemeral: true });
}
});


client.login(process.env.DISCORD_TOKEN);
