const { SlashCommandBuilder } = require("discord.js");
const { embed } = require("../../utils");
module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("Show APEX commands."),
  async execute(interaction) {
    await interaction.reply({ embeds: [embed("🤖 APEX Command Center",
`**Moderation**
/ban /kick /timeout /warn /warnings /clear

**Tickets**
/ticket panel /ticket close /ticket claim /ticket add /ticket remove

**Utility**
/ping /serverinfo /userinfo /help`)] });
  }
};
