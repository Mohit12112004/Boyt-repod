const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config/config");
require("./database/database");

if (!config.token || !config.clientId) {
  console.error("Missing DISCORD_TOKEN or CLIENT_ID in .env");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.DirectMessages],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

client.commands = new Collection();

function loadCommands(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) loadCommands(full);
    else if (item.endsWith(".js")) {
      const command = require(full);
      if (command.data && command.execute) client.commands.set(command.data.name, command);
    }
  }
}

loadCommands(path.join(__dirname, "commands"));

for (const file of fs.readdirSync(path.join(__dirname, "events"))) {
  if (file.endsWith(".js")) require(path.join(__dirname, "events", file))(client);
}

client.on("interactionCreate", async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction);
    } else if (interaction.isButton() || interaction.isStringSelectMenu()) {
      const handler = client.components?.get(interaction.customId);
      if (handler) await handler(interaction);
    }
  } catch (err) {
    console.error(err);
    const payload = { content: "❌ An unexpected error occurred.", ephemeral: true };
    if (interaction.replied || interaction.deferred) await interaction.followUp(payload).catch(()=>{});
    else await interaction.reply(payload).catch(()=>{});
  }
});

client.components = new Map();
require("./handlers/tickets")(client);
require("./events/forms")(client);
require("./events/reactionRoles")(client);

client.login(config.token);
