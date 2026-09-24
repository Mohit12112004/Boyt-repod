require("dotenv").config();
module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  botName: process.env.BOT_NAME || "APEX",
  primaryColor: process.env.PRIMARY_COLOR || "#00E5FF",
  roles: { admin: process.env.ADMIN_ROLE_ID || null, mod: process.env.MOD_ROLE_ID || null, support: process.env.SUPPORT_ROLE_ID || null, staff: process.env.STAFF_ROLE_ID || null },
  channels: {
    logs: process.env.LOG_CHANNEL_ID || null,
    ticketCategory: process.env.TICKET_CATEGORY_ID || null,
    welcome: process.env.WELCOME_CHANNEL_ID || null,
    leave: process.env.LEAVE_CHANNEL_ID || null
  },
  quarantineRoleId: process.env.QUARANTINE_ROLE_ID || null,
  antinuke: {
    enabled: process.env.ANTINUKE_ENABLED !== "false",
    windowMs: Number(process.env.ANTINUKE_WINDOW_MS || 10000),
    banLimit: Number(process.env.ANTINUKE_BAN_LIMIT || 3),
    kickLimit: Number(process.env.ANTINUKE_KICK_LIMIT || 3),
    channelDeleteLimit: Number(process.env.ANTINUKE_CHANNEL_DELETE_LIMIT || 3),
    roleDeleteLimit: Number(process.env.ANTINUKE_ROLE_DELETE_LIMIT || 3),
    webhookLimit: Number(process.env.ANTINUKE_WEBHOOK_LIMIT || 3)
  },
  automod: { enabled: process.env.AUTOMOD_ENABLED !== "false", maxMentions: Number(process.env.AUTOMOD_MAX_MENTIONS || 5), duplicateLimit: Number(process.env.AUTOMOD_DUPLICATE_LIMIT || 4), capsPercent: Number(process.env.AUTOMOD_CAPS_PERCENT || 85), blockedWords: (process.env.AUTOMOD_BLOCKED_WORDS || "").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean) }
};
