const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("../../database/database");
const { embed, isModerator } = require("../../utils");
module.exports={
 data:new SlashCommandBuilder().setName("warnings").setDescription("View member warnings.")
 .addUserOption(o=>o.setName("user").setDescription("User").setRequired(true))
 .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
 async execute(i){
   if(!isModerator(i.member)) return i.reply({content:"❌ You are not authorized.",ephemeral:true});
   const u=i.options.getUser("user");
   const rows=db.prepare("SELECT reason, moderator_id, created_at FROM warnings WHERE guild_id=? AND user_id=? ORDER BY id DESC LIMIT 10").all(i.guild.id,u.id);
   const desc=rows.length?rows.map((r,n)=>`**${n+1}.** ${r.reason} — <@${r.moderator_id}> <t:${Math.floor(r.created_at/1000)}:R>`).join("\n"):"No warnings found.";
   await i.reply({embeds:[embed(`⚠️ Warnings • ${u.tag}`,desc)]});
 }
};
