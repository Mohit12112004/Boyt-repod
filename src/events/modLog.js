const { AuditLogEvent } = require("discord.js");
const { log } = require("../log");
module.exports = client => {
 client.on("guildMemberAdd", m=>log(client,"Member Joined",`${m.user} joined **${m.guild.name}**.`,0x57F287,[{name:"User",value:`${m.user} (${m.id})`}]))
 .on("guildMemberRemove", m=>log(client,"Member Left",`${m.user.tag} left **${m.guild.name}**.`,0xED4245,[{name:"User ID",value:m.id}]))
 .on("messageDelete", m=>{if(!m.guild||m.author?.bot)return; log(client,"Message Deleted",`Message deleted in <#${m.channelId}>.`,0xED4245,[{name:"Author",value:`${m.author} (${m.author.id})`},{name:"Content",value:(m.content||"[No text content]").slice(0,1000)}])})
 .on("messageUpdate",(oldM,newM)=>{if(!newM.guild||newM.author?.bot||oldM.content===newM.content)return; log(client,"Message Edited",`Message edited in <#${newM.channelId}>.`,0xFEE75C,[{name:"Author",value:`${newM.author}`},{name:"Before",value:(oldM.content||"[empty]").slice(0,900)},{name:"After",value:(newM.content||"[empty]").slice(0,900)}])})
 .on("guildBanAdd",(ban)=>log(client,"Member Banned",`${ban.user.tag} was banned from **${ban.guild.name}**.`,0xED4245,[{name:"User",value:`${ban.user} (${ban.user.id})`}]))
 .on("guildBanRemove",(ban)=>log(client,"Member Unbanned",`${ban.user.tag} was unbanned.`,0x57F287,[{name:"User",value:`${ban.user} (${ban.user.id})`}]));
};
