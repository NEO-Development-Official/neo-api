const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'This API is accessible to users of the NEO Clanning Extension. For more information on how to effectively apply it into your own projects, see Welcome to the NEO API! Read http://docs.neobot.dev/api/clanning.' });
});

module.exports = router;
