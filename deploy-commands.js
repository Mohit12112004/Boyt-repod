const { REST, Routes } = require("discord.js");
const fs=require("fs"), path=require("path");
const config=require("./src/config/config");
const commands=[];
function load(dir){for(const f of fs.readdirSync(dir)){const p=path.join(dir,f);if(fs.statSync(p).isDirectory())load(p);else if(f.endsWith(".js")){const c=require(p);if(c.data)commands.push(c.data.toJSON());}}}
load(path.join(__dirname,"src/commands"));
const rest=new REST({version:"10"}).setToken(config.token);
(async()=>{
 try{
  console.log(`Registering ${commands.length} commands...`);
  if(config.guildId) await rest.put(Routes.applicationGuildCommands(config.clientId,config.guildId),{body:commands});
  else await rest.put(Routes.applicationCommands(config.clientId),{body:commands});
  console.log("✅ Commands registered.");
 }catch(e){console.error(e);}
})();
