// src/routes/mainRoute.js
const express = require('express');

const chatRoute = require('./openia/chatRoute');

const router = express.Router();

router.use('/openia',chatRoute);

module.exports = router;
