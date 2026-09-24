const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { isStaff } = require("../../utils");
module.exports={
 data:new SlashCommandBuilder().setName("ticket").setDescription("Manage APEX tickets.")
 .addSubcommand(s=>s.setName("panel").setDescription("Post the persistent ticket panel."))
 .addSubcommand(s=>s.setName("close").setDescription("Close the current ticket."))
 .addSubcommand(s=>s.setName("claim").setDescription("Claim the current ticket."))
 .addSubcommand(s=>s.setName("add").setDescription("Add a user to this ticket.").addUserOption(o=>o.setName("user").setDescription("User").setRequired(true)))
 .addSubcommand(s=>s.setName("remove").setDescription("Remove a user from this ticket.").addUserOption(o=>o.setName("user").setDescription("User").setRequired(true))),
 async execute(i){
   if(["close","claim","add","remove"].includes(i.options.getSubcommand()) && !isStaff(i.member))
     return i.reply({content:"❌ Staff only.",ephemeral:true});
   if(i.options.getSubcommand()==="panel") return require("../../handlers/tickets").sendPanel(i);
   const fn=require("../../handlers/tickets")[i.options.getSubcommand()];
   if(fn) return fn(i);
 }
};
