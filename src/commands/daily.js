const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');

module.exports = {
  data: new SlashCommandBuilder().setName('daily').setDescription('Réclamer la récompense quotidienne'),
  async execute(interaction) {
    const id = interaction.user.id;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) return interaction.reply({ content: 'Tu dois /register d\'abord.', ephemeral: true });

    // simple cooldown via quests table for demo (production: table cooldowns ou timestamp)
    const lastQuest = db.prepare('SELECT * FROM quests WHERE user_id = ? AND type = ? ORDER BY created_at DESC LIMIT 1').get(id, 'daily');
    const now = Date.now();
    if (lastQuest && (now - new Date(lastQuest.created_at).getTime()) < 24*60*60*1000) {
      return interaction.reply({ content: 'Tu as déjà pris ta récompense quotidienne aujourd\'hui.', ephemeral: true });
    }
    db.prepare('INSERT INTO quests (user_id, type, completed, reward_coins, created_at) VALUES (?, ?, 1, ?, datetime("now"))').run(id, 'daily', 100);
    db.prepare('UPDATE users SET coins = coins + ? WHERE id = ?').run(100, id);
    return interaction.reply({ content: 'Tu as reçu 100 pièces !', ephemeral: false });
  }
};
