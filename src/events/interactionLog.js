const { log } = require("../log");
module.exports = client => client.on("interactionCreate", async i => {
  if (!i.isChatInputCommand()) return;
  await log(client,"Command Used",`${i.user} used **/${i.commandName}** in ${i.guild ? `<#${i.channelId}>` : "DM"}`,[{name:"User",value:`${i.user} (${i.user.id})`},{name:"Command",value:`/${i.commandName}`}]);
});
