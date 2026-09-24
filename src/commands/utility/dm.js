const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { embed, isStaff } = require("../../utils");
const { log } = require("../../log");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dm")
    .setDescription("Send a personal DM to a user.")
    .addUserOption(o => o.setName("user").setDescription("Recipient").setRequired(true))
    .addStringOption(o => o.setName("message").setDescription("Message to send").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(i) {
    if (!isStaff(i.member)) {
      return i.reply({ content: "❌ Staff only.", ephemeral: true });
    }

    const user = i.options.getUser("user");
    const content = i.options.getString("message");

    try {
      await user.send({
        embeds: [embed("📩 APEX Staff Message",
          `You have received a direct message from the APEX staff team.\n\n**Message:**\n${content}`)]
      });
    } catch {
      return i.reply({ content: "❌ I couldn't DM that user. Their DMs may be disabled.", ephemeral: true });
    }

    await log(i.client, "Staff DM", `${i.user} sent a personal DM to ${user}.`, 0x00E5FF);
    await i.reply({ content: `✅ DM sent to ${user}.`, ephemeral: true });
  }
};
