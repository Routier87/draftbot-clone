const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');

function computeFightResult(userLevel) {
  // très simplifié : win chance dépend du level
  const enemyPower = Math.max(1, Math.floor(Math.random() * 5) + userLevel);
  const roll = Math.random() * (userLevel + 5);
  const win = roll >= enemyPower;
  return { win, xp: win ? 20 + userLevel*5 : 5, coins: win ? 50 : 10 };
}

module.exports = {
  data: new SlashCommandBuilder().setName('fight').setDescription('Combattre un monstre'),
  async execute(interaction) {
    const id = interaction.user.id;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) return interaction.reply({ content: 'Tu dois /register d\'abord.', ephemeral: true });

    const result = computeFightResult(user.level);
    if (result.win) {
      db.prepare('UPDATE users SET xp = xp + ?, coins = coins + ? WHERE id = ?').run(result.xp, result.coins, id);
      // level-up check simple
      const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
      const lvlNeeded = newUser.level * 100;
      if (newUser.xp >= lvlNeeded) {
        db.prepare('UPDATE users SET level = level + 1 WHERE id = ?').run(id);
        return interaction.reply({ content: `Victoire ! Tu gagnes ${result.coins} pièces et ${result.xp} XP. 🎉 Tu as monté de niveau !` });
      }
      return interaction.reply({ content: `Victoire ! Tu gagnes ${result.coins} pièces et ${result.xp} XP.` });
    } else {
      db.prepare('UPDATE users SET xp = xp + ? WHERE id = ?').run(result.xp, id);
      return interaction.reply({ content: `Tu as perdu... Tu obtiens ${result.xp} XP de consolation et ${result.coins} pièces.` });
    }
  }
};
