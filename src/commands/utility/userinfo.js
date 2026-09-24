const { SlashCommandBuilder } = require("discord.js");
const { embed } = require("../../utils");
module.exports = {
 data: new SlashCommandBuilder().setName("userinfo").setDescription("Show user information.")
   .addUserOption(o=>o.setName("user").setDescription("User").setRequired(false)),
 async execute(i){
   const u=i.options.getUser("user")||i.user;
   await i.reply({embeds:[embed(`👤 ${u.tag}`, `ID: \`${u.id}\`\nCreated: <t:${Math.floor(u.createdTimestamp/1000)}:F>\nMention: ${u}`)]});
 }
};
