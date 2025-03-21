const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  sessionId: { type: String, required: true }, // Identificador de sesión (puede ser generado en el front o backend)
  messages: [
    {
      role: { type: String, enum: ['user', 'assistant'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
