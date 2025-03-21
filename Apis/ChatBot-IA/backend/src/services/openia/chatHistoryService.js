const Chat = require('../../database/models/Chat');

exports.saveChat = async (sessionId, userMessage, botReply) => {
  try {
    // Buscar si ya existe la sesión de chat
    let chat = await Chat.findOne({ sessionId });
    if (!chat) {
      chat = new Chat({ sessionId, messages: [] });
    }
    // Guardar el mensaje del usuario y la respuesta del asistente
    chat.messages.push({ role: 'user', content: userMessage });
    chat.messages.push({ role: 'assistant', content: botReply });
    
    await chat.save();
    return chat;
  } catch (error) {
    throw new Error('Error al guardar el chat');
  }
};
