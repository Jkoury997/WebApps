// src/routes/mainRoute.js
const express = require('express');

const chatRoute = require('./openIA/chatRoute');

const router = express.Router();

router.use('/openia',chatRoute);

module.exports = router;
