const { log } = require("../log");
module.exports = client => client.on("voiceStateUpdate",(oldS,newS)=>{
 if(!newS.guild) return;
 let action = !oldS.channelId && newS.channelId ? "joined" : oldS.channelId && !newS.channelId ? "left" : oldS.channelId!==newS.channelId ? "moved" : "updated";
 log(client,"Voice Activity",`${newS.member.user} ${action} a voice channel.`,0x5865F2,[{name:"From",value:oldS.channel?.name||"None"},{name:"To",value:newS.channel?.name||"None"}]);
});
