const chatService = require('../../services/openIA/chatService');
const chatHistoryService = require('../../services/chatHistoryService');

exports.sendMessage = async (req, res, next) => {
    try {
      const { message, sessionId } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'El mensaje es requerido' });
      }
      if (!sessionId) {
        return res.status(400).json({ error: 'El sessionId es requerido para identificar la sesión de chat' });
      }
      
      // Obtiene la respuesta de la IA usando el sessionId para armar el contexto
      const reply = await chatService.getChatReply(sessionId, message);
      
      // Guarda la conversación en la base de datos
      await chatHistoryService.saveChat(sessionId, message, reply);
      
      res.json({ reply });
    } catch (error) {
      next(error);
    }
  };