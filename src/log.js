const { EmbedBuilder } = require("discord.js");
const config = require("./config/config");
async function log(client, title, description, color=config.primaryColor, fields=[]) {
  if (!config.channels.logs) return;
  const ch = await client.channels.fetch(config.channels.logs).catch(()=>null);
  if (!ch || !ch.isTextBased()) return;
  const e = new EmbedBuilder().setColor(color).setTitle(`📋 ${title}`).setDescription(description).setTimestamp().setFooter({text:`${config.botName} • Logs`});
  if(fields.length) e.addFields(fields.slice(0,25));
  await ch.send({embeds:[e]}).catch(()=>{});
}
module.exports={log};
