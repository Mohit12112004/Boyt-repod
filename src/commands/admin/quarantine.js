const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const config=require("../../config/config");
const {embed}=require("../../utils");
module.exports={data:new SlashCommandBuilder().setName("quarantine").setDescription("Quarantine controls.")
.addSubcommand(s=>s.setName("user").setDescription("Quarantine a member.").addUserOption(o=>o.setName("member").setDescription("Member").setRequired(true)))
.addSubcommand(s=>s.setName("release").setDescription("Release a member.").addUserOption(o=>o.setName("member").setDescription("Member").setRequired(true)))
.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
async execute(i){
 if(!config.quarantineRoleId)return i.reply({content:"❌ Configure QUARANTINE_ROLE_ID first.",ephemeral:true});
 const role=i.guild.roles.cache.get(config.quarantineRoleId),m=await i.guild.members.fetch(i.options.getUser("member").id).catch(()=>null);
 if(!role||!m)return i.reply({content:"❌ Role/member not found.",ephemeral:true});
 if(i.options.getSubcommand()==="user"){await m.roles.remove(m.roles.cache.filter(r=>r.id!==i.guild.id&&r.editable),"APEX quarantine").catch(()=>{});await m.roles.add(role,"APEX quarantine");return i.reply({embeds:[embed("🔒 Quarantined",`${m} has been quarantined.`)]});}
 await m.roles.remove(role,"APEX quarantine release").catch(()=>{});return i.reply({embeds:[embed("🔓 Released",`${m} has been released from quarantine.`)]});
}};