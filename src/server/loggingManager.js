const firebaseAdmin = require('firebase-admin');

async function getLogSetting(guildId) {
  const guildData = await firebaseAdmin.database().ref(`/guilds/${guildId}/guild_settings/logs/api`).once('value');
  return guildData.val();
}

module.exports = { getLogSetting }