const express = require('express');
const router = express.Router();
const { sendMessage } = require('../../controllers/openIA/chatController');

// Ruta POST para procesar mensajes del chat
router.post('/', sendMessage);

module.exports = router;
