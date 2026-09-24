const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { embed, isModerator } = require("../../utils");
module.exports={
 data:new SlashCommandBuilder().setName("timeout").setDescription("Timeout a member.")
 .addUserOption(o=>o.setName("user").setDescription("User").setRequired(true))
 .addIntegerOption(o=>o.setName("minutes").setDescription("Minutes").setMinValue(1).setMaxValue(40320).setRequired(true))
 .addStringOption(o=>o.setName("reason").setDescription("Reason"))
 .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
 async execute(i){
   if(!isModerator(i.member)) return i.reply({content:"❌ You are not authorized.",ephemeral:true});
   const u=i.options.getUser("user"), minutes=i.options.getInteger("minutes"), reason=i.options.getString("reason")||"No reason provided";
   const m=await i.guild.members.fetch(u.id).catch(()=>null);
   if(!m) return i.reply({content:"❌ Member not found.",ephemeral:true});
   await m.timeout(minutes*60*1000, reason);
   await i.reply({embeds:[embed("⏳ Member Timed Out", `${u} for **${minutes} minutes**.\n**Reason:** ${reason}`)]});
 }
};
