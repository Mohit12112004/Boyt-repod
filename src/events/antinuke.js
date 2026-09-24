const { AuditLogEvent } = require("discord.js");
const config = require("../config/config");
const { log } = require("../log");
const hits = new Map();

function exceeded(guildId, actorId, type, limit) {
  const key=`${guildId}:${actorId}:${type}`, now=Date.now();
  const arr=(hits.get(key)||[]).filter(t=>now-t<config.antinuke.windowMs);
  arr.push(now); hits.set(key,arr); return arr.length>=limit;
}
async function punish(guild, actorId, reason) {
  const m=await guild.members.fetch(actorId).catch(()=>null);
  if(!m || m.user.bot || m.id===guild.ownerId || m.id===guild.client.user.id) return;
  if(config.quarantineRoleId) {
    const role=guild.roles.cache.get(config.quarantineRoleId);
    if(role) {
      const removable=m.roles.cache.filter(r=>r.id!==guild.id && r.editable);
      await m.roles.remove(removable,`APEX Anti-Nuke: ${reason}`).catch(()=>{});
      await m.roles.add(role,`APEX Anti-Nuke: ${reason}`).catch(()=>{});
    }
  } else await m.timeout(28*24*60*60*1000,`APEX Anti-Nuke: ${reason}`).catch(()=>{});
  await log(guild.client,"🛡️ APEX Anti-Nuke",`**Actor:** <@${actorId}>\n**Action:** Quarantined\n**Reason:** ${reason}`,0xED4245);
}
async function detect(guild,type,targetId,limit) {
  if(!config.antinuke.enabled) return;
  await new Promise(r=>setTimeout(r,700));
  const logs=await guild.fetchAuditLogs({type,limit:10}).catch(()=>null);
  const e=logs?.entries.find(x=>x.target?.id===targetId && Date.now()-x.createdTimestamp<5000 && x.executor && !x.executor.bot);
  if(e && exceeded(guild.id,e.executor.id,String(type),limit))
    await punish(guild,e.executor.id,`Exceeded ${limit} ${String(type)} actions in ${config.antinuke.windowMs}ms`);
}
module.exports=client=>{
  client.on("channelDelete",c=>detect(c.guild,AuditLogEvent.ChannelDelete,c.id,config.antinuke.channelDeleteLimit));
  client.on("roleDelete",r=>detect(r.guild,AuditLogEvent.RoleDelete,r.id,config.antinuke.roleDeleteLimit));
  client.on("guildBanAdd",b=>detect(b.guild,AuditLogEvent.MemberBanAdd,b.user.id,config.antinuke.banLimit));
  client.on("guildMemberRemove",m=>detect(m.guild,AuditLogEvent.MemberKick,m.id,config.antinuke.kickLimit));
  client.on("webhookUpdate",async c=>{
    const logs=await c.guild.fetchAuditLogs({type:AuditLogEvent.WebhookCreate,limit:10}).catch(()=>null);
    const e=logs?.entries.find(x=>Date.now()-x.createdTimestamp<5000 && x.executor && !x.executor.bot);
    if(e && exceeded(c.guild.id,e.executor.id,"webhook",config.antinuke.webhookLimit))
      await punish(c.guild,e.executor.id,"Webhook abuse detected");
  });
};