const mongoose = require('mongoose');
require('dotenv').config();

// Función para conectar a MongoDB con mejor manejo de errores
const connectDB = async () => {
  console.log(process.env.URI_MONGODB)
  try {
    await mongoose.connect(process.env.URI_MONGODB, {

      serverSelectionTimeoutMS: 10000, // 10 segundos de timeout
      connectTimeoutMS: 10000, // Tiempo de espera para conectar
    });
    

    console.log('✅ Conectado a MongoDB:', process.env.URI_MONGODB);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    
    throw error
  }
};

module.exports = connectDB;
