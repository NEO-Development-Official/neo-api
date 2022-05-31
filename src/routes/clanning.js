const express = require('express');
const noblox = require('noblox.js')
const firebaseAdmin = require('firebase-admin')
const errorManager = require('http-errors')
const router = express.Router();

const authHandler = require('../middleware/authHandler')
const httpManager = require('../server/httpManager');
const errorHandler = require('../middleware/errorHander')

router.get('/', (req, res, next) => {
  res.send({ message: 'This API is accessible to users of the NEO Clanning Extension. For more information on how to effectively apply it into your own projects, see Welcome to the NEO API! Read http://docs.neobot.dev/api/clanning.' });
});

router.get('/xp/:id', async (req, res, next) => {
  const authPackage = await authHandler.checkPackage(req, res, await authHandler.getPackage(req, res));
  const authenticationResponse = await authHandler.authenticatePackage(req, res, authPackage)
  if (authenticationResponse.authenticated === true) {
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
    .catch(err => {const userNotFound = errorManager(404, 'NEO 330: User Not Found'); return errorHandler(userNotFound, req, res)})
  
    if (req.params.num.includes('-')) {
      neoDatabase.ref(`guilds/${authenticationResponse.guild}/users/${req.params.id}`).update({ xp: playerExperience - Number(req.params.num.replace(/[^0-9]/g,'')) }); completeExperience = playerExperience - Number(req.params.num)
    } else {
      neoDatabase.ref(`guilds/${authenticationResponse.guild}/users/${req.params.id}`).update({ xp: playerExperience + Number(req.params.num) }); completeExperience = playerExperience + Number(req.params.num)
    }

    const responsePacket = {
      id: req.params.id,
      username: playerData,
      increment: req.params.num,
      xp: completeExperience
    }; return res.send(responsePacket);
  }
});

module.exports = router;
