const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DATABASE || path.join(__dirname, '..', 'data', 'game.sqlite');
const db = new Database(dbPath);

// initialisation tables
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT,
  coins INTEGER DEFAULT 100,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  item TEXT,
  qty INTEGER DEFAULT 1,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS quests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  type TEXT,
  progress INTEGER DEFAULT 0,
  target INTEGER DEFAULT 1,
  reward_coins INTEGER DEFAULT 50,
  completed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`).run();

module.exports = db;
