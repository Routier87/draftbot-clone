const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');


module.exports = {
data: new SlashCommandBuilder().setName('profile').setDescription('Voir un profil')
.addUserOption(o => o.setName('user').setDescription('Optionnel')),


async execute(i) {
const usr = i.options.getUser('user') || i.user;
const d = db.prepare('SELECT * FROM users WHERE id = ?').get(usr.id);
if (!d) return i.reply({ content: 'Aucun profil.', ephemeral: true });
i.reply({ embeds: [{ title: usr.username, fields: [
{ name: 'Coins', value: `${d.coins}` },
{ name: 'XP', value: `${d.xp}` },
{ name: 'Level', value: `${d.level}` }
] }] });
}
};
