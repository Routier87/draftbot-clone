const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');

module.exports = {
  data: new SlashCommandBuilder().setName('profile').setDescription('Afficher ton profil')
    .addUserOption(opt => opt.setName('user').setDescription('Utilisateur (optionnel)')),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
    if (!row) return interaction.reply({ content: 'Aucun profil trouvé. Demande à la personne de faire /register', ephemeral: true });
    return interaction.reply({
      embeds: [{
        title: `${user.tag} — profile`,
        fields: [
          { name: 'Pieces', value: String(row.coins), inline: true },
          { name: 'XP', value: String(row.xp), inline: true },
          { name: 'Level', value: String(row.level), inline: true },
        ]
      }]
    });
  }
};
