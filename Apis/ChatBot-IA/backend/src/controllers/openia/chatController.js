// src/controllers/chatController.js
const { getChatResponse } = require('../services/chatService.js');

async function handleChatRequest(req, res) {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No se proporcionó el mensaje' });
  }

  try {
    const answer = await getChatResponse(message);
    return res.json({ answer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ocurrió un error al procesar tu solicitud.' });
  }
}

module.exports = {
  handleChatRequest
};
