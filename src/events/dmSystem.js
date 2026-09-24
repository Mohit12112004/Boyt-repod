const db = require("../database/database");
const { embed, isStaff } = require("../utils");
const { log } = require("../log");

module.exports = client => {
  client.on("messageCreate", async message => {
    if (message.author.bot) return;

    // User -> APEX DM: find the user's open ticket and relay the message into it.
    if (!message.guild) {
      const tickets = db.prepare(
        "SELECT * FROM tickets WHERE user_id=? AND status='open' ORDER BY id DESC LIMIT 1"
      ).get(message.author.id);

      if (!tickets) {
        await message.author.send({
          embeds: [embed("🤖 APEX Support", "You don't currently have an open ticket. Please open a ticket in the APEX Discord server.")]
        }).catch(() => {});
        return;
      }

      const channel = await client.channels.fetch(tickets.channel_id).catch(() => null);
      if (!channel) return;

      await channel.send({
        embeds: [embed("📩 User DM", `**${message.author.tag}:**\n${message.content || "*Attachment / media sent*"}\n\n> This message was sent through the user's personal DM.`)]
      });

      if (message.attachments.size) {
        await channel.send({
          content: `📎 **Attachments:** ${message.attachments.map(a => a.url).join("\n")}`
        }).catch(() => {});
      }

      await log(client, "Ticket DM Received",
        `${message.author} replied to ticket #${tickets.id} through personal DM.`,
        0x00E5FF,
        [{ name: "Ticket", value: `<#${tickets.channel_id}>` }]);
      return;
    }

    // Staff -> User DM relay: messages in an APEX ticket channel are sent to the ticket owner.
    const ticket = db.prepare(
      "SELECT * FROM tickets WHERE channel_id=? AND status='open'"
    ).get(message.channel.id);

    if (!ticket || !isStaff(message.member)) return;

    const user = await client.users.fetch(ticket.user_id).catch(() => null);
    if (!user) return;

    const body = message.content?.trim() || "*Attachment / media sent*";
    const dm = embed("🎫 APEX Support • Staff Reply",
      `A staff member has replied to your ticket.\n\n**Message:**\n${body}\n\n**Ticket:** #${ticket.id}\n\nYou can reply directly to this DM and APEX will forward your response to the ticket.`);

    await user.send({ embeds: [dm] }).catch(async () => {
      await message.react("⚠️").catch(() => {});
    });

    if (message.attachments.size) {
      await user.send({
        content: `📎 **Staff attachment(s):**\n${message.attachments.map(a => a.url).join("\n")}`
      }).catch(() => {});
    }

    await log(client, "Ticket DM Sent",
      `${message.author} sent a staff reply to the ticket owner via DM.`,
      0x57F287,
      [{ name: "Ticket", value: `<#${message.channel.id}>` }, { name: "User", value: `<@${ticket.user_id}>` }]);
  });
};
