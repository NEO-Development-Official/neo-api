const express = require('express');
const errorManager = require('http-errors')
const router = express.Router();

const authHandler = require('../middleware/authHandler')
const errorHandler = require('../middleware/errorHander')

router.get('/', (req, res, next) => {
  res.send({ message: 'This API is accessible to users of the NEO Clanning Extension. For more information on how to effectively apply it into your own projects, see Welcome to the NEO API! Read http://docs.neobot.dev/api/clanning.' });
});

router.get('/xp/:id', async (req, res, next) => {
  const authToken = await authHandler.getCookie(req, res)
  if (authToken == false) {
    const insufficientError = errorManager(404, 'Insufficient Authentication Token!')
    return errorHandler(insufficientError, req, res, next);
  }
});

module.exports = router;
