// src/routes/chatRoutes.js
const express = require('express');
const { handleChatRequest } = require('../../controllers/openia/chatController');

const router = express.Router();

router.post('/chat', handleChatRequest);

module.exports = router;
