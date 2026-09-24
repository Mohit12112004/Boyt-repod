const { EmbedBuilder } = require("discord.js");
const config = require("./config/config");

function embed(title, description, color = config.primaryColor) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: `${config.botName} • Discord Bot` })
    .setTimestamp();
}

function hasRole(member, roleId) {
  return !!roleId && member.roles?.cache?.has(roleId);
}

function isStaff(member) {
  return member.permissions.has("Administrator") ||
    hasRole(member, config.roles.admin) ||
    hasRole(member, config.roles.mod) ||
    hasRole(member, config.roles.support);
}

function isModerator(member) {
  return member.permissions.has("BanMembers") ||
    member.permissions.has("ModerateMembers") ||
    hasRole(member, config.roles.admin) ||
    hasRole(member, config.roles.mod);
}

module.exports = { embed, hasRole, isStaff, isModerator };
