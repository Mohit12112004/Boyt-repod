const { SlashCommandBuilder } = require("discord.js");
const { embed } = require("../../utils");
module.exports = {
 data: new SlashCommandBuilder().setName("ping").setDescription("Check bot latency."),
 async execute(i){ await i.reply({embeds:[embed("🏓 Pong!", `API Latency: **${i.client.ws.ping}ms**`)]}); }
};
