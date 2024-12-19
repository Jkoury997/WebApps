// src/services/chatService.js
require('dotenv').config();

const { Configuration, OpenAIApi } = require('openai');

// Configurar el cliente de OpenAI con tu API Key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getChatResponse(userMessage) {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }]
    });

    const answer = completion.data.choices && completion.data.choices[0] && completion.data.choices[0].message
      ? completion.data.choices[0].message.content
      : 'No tengo una respuesta en este momento.';

    return answer;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener respuesta de OpenAI');
  }
}

module.exports = {
  getChatResponse
};
