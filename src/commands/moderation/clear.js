const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports={
 data:new SlashCommandBuilder().setName("clear").setDescription("Delete recent messages.")
 .addIntegerOption(o=>o.setName("amount").setDescription("1-100").setMinValue(1).setMaxValue(100).setRequired(true))
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
 async execute(i){
   const n=i.options.getInteger("amount");
   const deleted=await i.channel.bulkDelete(n,true);
   await i.reply({content:`🧹 Deleted **${deleted.size}** messages.`,ephemeral:true});
 }
};
