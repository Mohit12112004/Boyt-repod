module.exports = client => {
  client.once("ready", c => {
    console.log(`✅ ${c.user.tag} is online.`);
    c.user.setPresence({
      activities: [{ name: "/help • APEX", type: 3 }],
      status: "online"
    });
  });
};
