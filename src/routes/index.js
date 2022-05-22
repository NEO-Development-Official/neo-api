const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ message: "Welcome to the NEO API! Read http://docs.neobot.dev/api/ for documentation." });
});

module.exports = router;
