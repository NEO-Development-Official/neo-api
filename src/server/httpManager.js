// @ts-nocheck
const fetch = require("node-fetch");
const clanningFirebase = 'https://neo-ranking-default-rtdb.firebaseio.com';

async function getJson(url) {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return {
      success: response.status === 200 ? true : false,
      status: response.status,
      data: json,
    };
  } catch (ex) {
    return {
      success: false,
    };
  }
}

module.exports = { getJson, clanningFirebase };
