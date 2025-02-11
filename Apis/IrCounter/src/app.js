require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/db');  // Conexión a MongoDB
const initTcp = require('./IRService'); // Importa el servicio TCP



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Para leer JSON en requests

// Configurar trust proxy si estás detrás de un proxy
app.set('trust proxy', true);



// Conectar a MongoDB y luego iniciar el servidor y TCP
connectDB().then(() => {
    initTcp(); // Ahora iniciamos el servicio TCP después de la conexión a MongoDB
  
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  }).catch(error => {
    console.error('❌ No se pudo conectar a la base de datos, el servidor no se iniciará.');
    process.exit(1);
  });