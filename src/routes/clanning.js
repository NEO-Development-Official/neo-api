const express = require('express');
const noblox = require('noblox.js')
const firebaseAdmin = require('firebase-admin')
const errorManager = require('http-errors')
const router = express.Router();

const authHandler = require('../middleware/authHandler')
const httpManager = require('../server/httpManager');
const loggingManager = require('../server/loggingManager');
const errorHandler = require('../middleware/errorHander')

router.get('/', (req, res, next) => {
  res.send({ message: 'This API is accessible to users of the NEO Clanning Extension. For more information on how to effectively apply it into your own projects, see Welcome to the NEO API! Read http://docs.neobot.dev/api/clanning.' });
});

router.get('/xp/:id', async (req, res, next) => {
  const authPackage = await authHandler.checkPackage(req, res, await authHandler.getPackage(req, res));
  const authenticationResponse = await authHandler.authenticatePackage(req, res, authPackage)
  if (authenticationResponse.authenticated === true) {
    
    console.log(await loggingManager.getLogSetting(authenticationResponse.guild))

    let playerExperience = await (await httpManager.getJson(httpManager.clanningFirebase + `/guilds/${authenticationResponse.guild}/users/${req.params.id}/xp.json`)).data; if (playerExperience == null) { playerExperience = 0 }
    const resPacket = { id: req.params.id, xp: playerExperience };
    res.send(resPacket)
  }
});

router.post('/xp/:id/increment/:num', async (req, res, next) => {
  const neoDatabase = firebaseAdmin.database();
  const authPackage = await authHandler.checkPackage(req, res, await authHandler.getPackage(req, res));
  const authenticationResponse = await authHandler.authenticatePackage(req, res, authPackage)

  if (authenticationResponse.authenticated === true) {
    let playerExperience = await (await httpManager.getJson(httpManager.clanningFirebase + `/guilds/${authenticationResponse.guild}/users/${req.params.id}/xp.json`)).data; if (playerExperience == null) { playerExperience = 0 }; let completeExperience = 0;
    const playerData = await noblox.getUsernameFromId(Number(req.params.id))
      .catch(err => { const userNotFound = errorManager(404, 'NEO 330: User Not Found'); return errorHandler(userNotFound, req, res) })
    
    const mathOperation = Number(req.params.num) > 0 ? '+' : '-';
    const rawNum = Number(req.params.num) > 0 ? Number(req.params.num) : Number(req.params.num) * -1;
  
    if (mathOperation === '+') { neoDatabase.ref(`/guilds/${authenticationResponse.guild}/users/${req.params.id}`).update({ xp: playerExperience + rawNum }); completeExperience = playerExperience + rawNum; }
    else {neoDatabase.ref(`/guilds/${authenticationResponse.guild}/users/${req.params.id}`).update({ xp: playerExperience - rawNum }); completeExperience = playerExperience - rawNum;}

    const responsePacket = { id: req.params.id, username: playerData, increment: mathOperation + rawNum, xp: completeExperience };
    return res.send(responsePacket);
  }
});

router.post('/xp/:id/set/:num', async (req, res, next) => {
  const neoDatabase = firebaseAdmin.database();
  const authPackage = await authHandler.checkPackage(req, res, await authHandler.getPackage(req, res));
  const authenticationResponse = await authHandler.authenticatePackage(req, res, authPackage)

  if (authenticationResponse.authenticated === true) {
    let playerExperience = await (await httpManager.getJson(httpManager.clanningFirebase + `/guilds/${authenticationResponse.guild}/users/${req.params.id}/xp.json`)).data; if (playerExperience == null) { playerExperience = 0 }; let completeExperience = 0;
    const playerData = await noblox.getUsernameFromId(Number(req.params.id))
      .catch(err => { const userNotFound = errorManager(404, 'NEO 330: User Not Found'); return errorHandler(userNotFound, req, res) })
    
    const isNumber = isNaN(Number(req.params.num)) ? false : true;
    if (isNumber === false) { const NaNError = errorManager(406, 'NEO 660: Not a Number'); return errorHandler(NaNError, req, res) }

    neoDatabase.ref(`/guilds/${authenticationResponse.guild}/users/${req.params.id}`).update({ xp: Number(req.params.num) }); completeExperience = Number(req.params.num)

    const responsePacket = { id: req.params.id, username: playerData, previousExperience: playerExperience, xp: completeExperience };
    return res.send(responsePacket);
  }
});

module.exports = router;
