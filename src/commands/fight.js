const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');


function fight(level) {
const enemy = Math.floor(Math.random() * 5) + level;
const roll = Math.random() * (level + 5);
const win = roll >= enemy;
return { win, xp: win ? 20 + level * 5 : 5, coins: win ? 50 : 10 };
}


module.exports = {
data: new SlashCommandBuilder().setName('fight').setDescription('Combat'),


async execute(i) {
const id = i.user.id;
const u = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
if (!u) return i.reply({ content: 'Fais /register', ephemeral: true });


const r = fight(u.level);


db.prepare('UPDATE users SET xp = xp + ?, coins = coins + ? WHERE id = ?').run(r.xp, r.coins, id);


let msg = r.win ? `Victoire ! +${r.coins} coins +${r.xp} XP` : `Défaite... +${r.xp} XP +${r.coins} coins`;


const up = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
if (up.xp >= up.level * 100) {
db.prepare('UPDATE users SET level = level + 1 WHERE id = ?').run(id);
msg += '
🎉 Level up!';
}


i.reply(msg);
}
};
