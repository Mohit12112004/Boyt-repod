const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { embed, isModerator } = require("../../utils");
module.exports={
 data:new SlashCommandBuilder().setName("ban").setDescription("Ban a member.")
 .addUserOption(o=>o.setName("user").setDescription("User").setRequired(true))
 .addStringOption(o=>o.setName("reason").setDescription("Reason").setRequired(false))
 .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
 async execute(i){
   if(!isModerator(i.member)) return i.reply({content:"❌ You are not authorized.",ephemeral:true});
   const u=i.options.getUser("user"), reason=i.options.getString("reason")||"No reason provided";
   const m=await i.guild.members.fetch(u.id).catch(()=>null);
   if(!m) return i.reply({content:"❌ Member not found.",ephemeral:true});
   await m.ban({reason});
   await i.reply({embeds:[embed("🔨 Member Banned", `${u} was banned.\n**Reason:** ${reason}`)]});
 }
};
