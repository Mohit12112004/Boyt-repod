const config=require("../config/config"); const {log}=require("../log");
const recent=new Map();
module.exports=client=>client.on("messageCreate",async m=>{
 if(!m.guild||m.author.bot||!config.automod.enabled) return;
 const member=m.member; if(member?.permissions.has("ManageMessages")||member?.permissions.has("Administrator")) return;
 const text=(m.content||"").trim(); const lower=text.toLowerCase();
 let reason=null;
 if(config.automod.blockedWords.some(w=>lower.includes(w))) reason="Blocked word/phrase";
 const mentions=m.mentions.users.size+m.mentions.roles.size; if(!reason&&mentions>=config.automod.maxMentions) reason="Mention spam";
 const letters=text.replace(/[^a-zA-Z]/g,""); const upper=letters.replace(/[^A-Z]/g,"").length; if(!reason&&letters.length>=12&&(upper/letters.length)*100>=config.automod.capsPercent) reason="Excessive caps";
 const key=`${m.guild.id}:${m.author.id}`; const arr=recent.get(key)||[]; arr.push(text); while(arr.length>config.automod.duplicateLimit)arr.shift(); recent.set(key,arr); if(!reason&&arr.length>=config.automod.duplicateLimit&&new Set(arr).size===1) reason="Repeated message spam";
 if(!reason)return;
 await m.delete().catch(()=>{}); await log(client,"Auto-Moderation",`${m.author} triggered APEX AutoMod.`,0xED4245,[{name:"Action",value:"Message deleted"},{name:"Reason",value:reason},{name:"Channel",value:`<#${m.channelId}>`}]);
});
