const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');


module.exports = {
data: new SlashCommandBuilder().setName('register').setDescription('Créer un profil'),
async execute(i) {
const id = i.user.id;
const ex = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
if (ex) return i.reply({ content: 'Profil existant.', ephemeral: true });
db.prepare('INSERT INTO users (id, username, coins) VALUES (?, ?, ?)').run(id, i.user.tag, 200);
i.reply('Profil créé ! +200 coins');
}
};
