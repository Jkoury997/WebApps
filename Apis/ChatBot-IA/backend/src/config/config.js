require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  CLIENT_URL: process.env.CLIENT_URL || '*',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/mi_chatbot'
};
