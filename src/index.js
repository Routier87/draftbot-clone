require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
}

client.once('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, client);
  } catch (err) {
    console.error(err);
    if (interaction.replied || interaction.deferred) {
      interaction.followUp({ content: 'Erreur lors de l\'exécution.', ephemeral: true });
    } else {
      interaction.reply({ content: 'Erreur lors de l\'exécution.', ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
