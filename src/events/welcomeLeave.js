const { EmbedBuilder }=require("discord.js");
const config=require("../config/config"); const {log}=require("../log");
const cache=new Map();
async function refresh(g){const is=await g.invites.fetch().catch(()=>null);if(!is)return;const m=new Map();is.forEach(x=>m.set(x.code,{uses:x.uses||0,inviterId:x.inviter?.id||null}));cache.set(g.id,m);}
module.exports=client=>{
 client.once("ready",async()=>{for(const g of client.guilds.cache.values())await refresh(g);});
 client.on("inviteCreate",i=>refresh(i.guild));
 client.on("guildMemberAdd",async m=>{
  const old=cache.get(m.guild.id)||new Map(), cur=await m.guild.invites.fetch().catch(()=>null);let used=null;
  cur?.forEach(i=>{if((i.uses||0)>(old.get(i.code)?.uses||0))used=i;}); await refresh(m.guild);
  const c=config.channels.welcome?m.guild.channels.cache.get(config.channels.welcome):null;
  const e=new EmbedBuilder().setColor(config.primaryColor).setTitle(`👋 Welcome to ${m.guild.name}`).setDescription(`${m}\n\nWelcome to the server!`).setThumbnail(m.user.displayAvatarURL()).setFooter({text:"APEX"}).setTimestamp();
  if(c)await c.send({embeds:[e]}).catch(()=>{});
  await m.send({embeds:[e.setDescription(`Welcome, **${m.user.username}**!\n\nPlease read the server rules. If you need help, open a support ticket.`)]}).catch(()=>{});
  await log(client,"Member Joined",`${m} joined the server.`,0x57F287,[{name:"Invite",value:used?`\`${used.code}\` • <@${used.inviter?.id}>`:"Unknown/direct invite"}]);
 });
 client.on("guildMemberRemove",async m=>{
  const c=config.channels.leave?m.guild.channels.cache.get(config.channels.leave):null;
  if(c)await c.send({embeds:[new EmbedBuilder().setColor(0xED4245).setTitle("👋 Member Left").setDescription(`**${m.user.tag}** has left the server.`).setThumbnail(m.user.displayAvatarURL()).setFooter({text:"APEX"}).setTimestamp()]}).catch(()=>{});
  await log(client,"Member Left",`**${m.user.tag}** left the server.`,0xED4245);
 });
};