const Database = require("better-sqlite3");
const path = require("path");
const db = new Database(path.join(__dirname, "../../data/apex.sqlite"));
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS warnings(id INTEGER PRIMARY KEY AUTOINCREMENT,guild_id TEXT NOT NULL,user_id TEXT NOT NULL,moderator_id TEXT NOT NULL,reason TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS tickets(id INTEGER PRIMARY KEY AUTOINCREMENT,guild_id TEXT NOT NULL,channel_id TEXT UNIQUE NOT NULL,user_id TEXT NOT NULL,category TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'open',claimed_by TEXT,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS settings(guild_id TEXT NOT NULL,key TEXT NOT NULL,value TEXT,PRIMARY KEY(guild_id,key));
CREATE TABLE IF NOT EXISTS staff(id INTEGER PRIMARY KEY AUTOINCREMENT,guild_id TEXT NOT NULL,user_id TEXT NOT NULL,action TEXT NOT NULL,reason TEXT,moderator_id TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS reaction_roles(guild_id TEXT NOT NULL,message_id TEXT NOT NULL,emoji TEXT NOT NULL,role_id TEXT NOT NULL,PRIMARY KEY(guild_id,message_id,emoji));
CREATE TABLE IF NOT EXISTS security_actions(id INTEGER PRIMARY KEY AUTOINCREMENT,guild_id TEXT NOT NULL,actor_id TEXT NOT NULL,action TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS invite_snapshots(guild_id TEXT NOT NULL,code TEXT NOT NULL,uses INTEGER NOT NULL DEFAULT 0,inviter_id TEXT,PRIMARY KEY(guild_id,code));
CREATE TABLE IF NOT EXISTS forms(id INTEGER PRIMARY KEY AUTOINCREMENT,guild_id TEXT NOT NULL,user_id TEXT NOT NULL,type TEXT NOT NULL,data TEXT NOT NULL,created_at INTEGER NOT NULL);
`);
module.exports=db;
