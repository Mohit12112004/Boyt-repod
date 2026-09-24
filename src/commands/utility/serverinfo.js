const { SlashCommandBuilder } = require("discord.js");
const { embed } = require("../../utils");
module.exports = {
 data: new SlashCommandBuilder().setName("serverinfo").setDescription("Show server information."),
 async execute(i){
   const g=i.guild;
   await i.reply({embeds:[embed(`📊 ${g.name}`, `Owner: <@${g.ownerId}>\nMembers: **${g.memberCount}**\nChannels: **${g.channels.cache.size}**\nRoles: **${g.roles.cache.size}**\nCreated: <t:${Math.floor(g.createdTimestamp/1000)}:F>`)]});
 }
};
