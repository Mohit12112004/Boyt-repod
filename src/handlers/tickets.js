const {
  ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle,
  ChannelType, PermissionsBitField
} = require("discord.js");
const db=require("../database/database");
const config=require("../config/config");
const {embed,isStaff}=require("../utils");
const {log}=require("../log");

function register(client){
  client.components.set("ticket_select", async i=>{
    const category=i.values[0];
    const existing=db.prepare("SELECT * FROM tickets WHERE guild_id=? AND user_id=? AND status='open'").get(i.guild.id,i.user.id);
    if(existing) return i.reply({content:`❌ You already have an open ticket: <#${existing.channel_id}>`,ephemeral:true});
    const ch=await i.guild.channels.create({
      name:`ticket-${i.user.username}`.toLowerCase().replace(/[^a-z0-9-]/g,"").slice(0,80),
      type:ChannelType.GuildText,
      parent:config.channels.ticketCategory||undefined,
      permissionOverwrites:[
        {id:i.guild.id,deny:[PermissionsBitField.Flags.ViewChannel]},
        {id:i.user.id,allow:[PermissionsBitField.Flags.ViewChannel,PermissionsBitField.Flags.SendMessages,PermissionsBitField.Flags.ReadMessageHistory]}
      ]
    });
    if(config.roles.support) await ch.permissionOverwrites.create(config.roles.support,{ViewChannel:true,SendMessages:true,ReadMessageHistory:true});
    db.prepare("INSERT INTO tickets(guild_id,channel_id,user_id,category,created_at) VALUES(?,?,?,?,?)").run(i.guild.id,ch.id,i.user.id,category,Date.now());
    const buttons=new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("ticket_claim").setLabel("Claim").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("ticket_close").setLabel("Close").setStyle(ButtonStyle.Danger)
    );
    await ch.send({content:`<@${i.user.id}>`,embeds:[embed("🎫 APEX Support",`**Category:** ${category}\n\nPlease describe your issue. A staff member will assist you shortly.`)],components:[buttons]});
    await log(i.client,"Ticket Created",`${i.user} created ${ch}.`,0x57F287,[{name:"Category",value:category}]);
    await i.reply({content:`✅ Ticket created: ${ch}`,ephemeral:true});
  });
  client.components.set("ticket_claim", async i=>claim(i));
  client.components.set("ticket_close", async i=>close(i));
}
async function sendPanel(i){
 const menu=new StringSelectMenuBuilder().setCustomId("ticket_select").setPlaceholder("Select a ticket category").addOptions(
  {label:"General Support",value:"General Support",emoji:"🎫"},
  {label:"Staff Application",value:"Staff Application",emoji:"👮"},
  {label:"Player Report",value:"Player Report",emoji:"🚨"},
  {label:"Ban Appeal",value:"Ban Appeal",emoji:"⚖️"},
  {label:"Business Application",value:"Business Application",emoji:"🏢"},
  {label:"Gang Application",value:"Gang Application",emoji:"🔫"}
 );
 await i.channel.send({embeds:[embed("🎫 APEX Support Center","Need assistance? Select a category below to create a private ticket.")],components:[new ActionRowBuilder().addComponents(menu)]});
 await i.reply({content:"✅ Ticket panel posted.",ephemeral:true});
}
async function claim(i){
 const t=db.prepare("SELECT * FROM tickets WHERE channel_id=? AND status='open'").get(i.channel.id);
 if(!t) return i.reply({content:"❌ This is not an open APEX ticket.",ephemeral:true});
 db.prepare("UPDATE tickets SET claimed_by=? WHERE channel_id=?").run(i.user.id,i.channel.id);
 await log(i.client,"Ticket Claimed",`${i.user} claimed ${i.channel}.`);
 await i.reply({embeds:[embed("👤 Ticket Claimed",`This ticket is now claimed by ${i.user}.`)]});
}
async function close(i){
 const t=db.prepare("SELECT * FROM tickets WHERE channel_id=? AND status='open'").get(i.channel.id);
 if(!t) return i.reply({content:"❌ This is not an open APEX ticket.",ephemeral:true});
 db.prepare("UPDATE tickets SET status='closed' WHERE channel_id=?").run(i.channel.id);
 await log(i.client,"Ticket Closed",`${i.user} closed ${i.channel}.`,0xED4245);
 await i.reply({embeds:[embed("🔒 Ticket Closed","This ticket will be deleted in 5 seconds.")]});
 setTimeout(()=>i.channel.delete("APEX ticket closed").catch(()=>{}),5000);
}
async function add(i){const u=i.options.getUser("user"); await i.channel.permissionOverwrites.create(u,{ViewChannel:true,SendMessages:true,ReadMessageHistory:true}); await i.reply({content:`✅ Added ${u}.`,ephemeral:true});}
async function remove(i){const u=i.options.getUser("user"); await i.channel.permissionOverwrites.delete(u.id).catch(()=>{}); await i.reply({content:`✅ Removed ${u}.`,ephemeral:true});}
register.sendPanel=sendPanel; register.claim=claim; register.close=close; register.add=add; register.remove=remove;
module.exports=register;
