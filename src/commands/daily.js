const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');


module.exports = {
data: new SlashCommandBuilder().setName('daily').setDescription('Récompense quotidienne'),


async execute(i) {
const id = i.user.id;
const u = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
if (!u) return i.reply({ content: 'Fais /register', ephemeral: true });


const last = db.prepare('SELECT * FROM quests WHERE user_id = ? AND type = ? ORDER BY created_at DESC LIMIT 1').get(id, 'daily');
if (last && (Date.now() - new Date(last.created_at).getTime()) < 86400000)
return i.reply({ content: 'Déjà réclamé.', ephemeral: true });


db.prepare('INSERT INTO quests (user_id, type, completed, reward_coins) VALUES (?, ?, 1, 100)').run(id, 'daily');
db.prepare('UPDATE users SET coins = coins + 100 WHERE id = ?').run(id);


i.reply('🎁 +100 coins !');
}
};
