const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');

module.exports = {
  data: new SlashCommandBuilder().setName('register').setDescription('Créer ton profil'),
  async execute(interaction) {
    const id = interaction.user.id;
    const exists = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (exists) return interaction.reply({ content: 'Profil déjà créé.', ephemeral: true });
    db.prepare('INSERT INTO users (id, username, coins) VALUES (?, ?, ?)').run(id, interaction.user.tag, 200);
    return interaction.reply({ content: 'Profil créé ! Tu as reçu 200 pièces.', ephemeral: true });
  }
};
