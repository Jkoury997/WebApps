const axios = require('axios');
const Chat = require('../../database/models/Chat');
const { OPENAI_API_KEY } = require('../../config/config');

exports.getChatReply = async (sessionId, newMessage) => {
  // Recupera el historial de mensajes usando el sessionId
  let messages = [];
  const chatHistory = await Chat.findOne({ sessionId });
  if (chatHistory) {
    // Convierte cada mensaje del historial al formato esperado por la API
    messages = chatHistory.messages.map(m => ({
      role: m.role,
      content: m.content
    }));
  }

  // Agrega el nuevo mensaje del usuario al final del historial
  messages.push({ role: "user", content: newMessage });

  // Opcional: Agrega un mensaje de sistema que defina el comportamiento del asistente
  const fullMessages = [
    { role: "system", content: "Eres un asistente útil para ecommerce." },
    ...messages
  ];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: fullMessages
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error('Error al conectar con la IA');
  }
};