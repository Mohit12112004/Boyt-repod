const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("../../database/database");
const { embed, isModerator } = require("../../utils");
module.exports={
 data:new SlashCommandBuilder().setName("warn").setDescription("Warn a member.")
 .addUserOption(o=>o.setName("user").setDescription("User").setRequired(true))
 .addStringOption(o=>o.setName("reason").setDescription("Reason").setRequired(true))
 .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
 async execute(i){
   if(!isModerator(i.member)) return i.reply({content:"❌ You are not authorized.",ephemeral:true});
   const u=i.options.getUser("user"), reason=i.options.getString("reason");
   db.prepare("INSERT INTO warnings(guild_id,user_id,moderator_id,reason,created_at) VALUES(?,?,?,?,?)").run(i.guild.id,u.id,i.user.id,reason,Date.now());
   const count=db.prepare("SELECT COUNT(*) c FROM warnings WHERE guild_id=? AND user_id=?").get(i.guild.id,u.id).c;
   await i.reply({embeds:[embed("⚠️ Warning Issued", `${u} received a warning.\n**Reason:** ${reason}\n**Total warnings:** ${count}`)]});
 }
};
