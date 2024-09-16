const express = require('express');
const connectDB = require('./database/db');
const mainRoute = require('./routes/mainRoute');
const morgan = require('morgan');
const cors = require('cors');
const errorMiddleware = require("./middlewares/errorMiddleware")
require('dotenv').config();





const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin: '*', // Asegúrate de permitir tu dominio específico si es necesario
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
// Configurar trust proxy si estás detrás de un proxy
app.set('trust proxy', true);

// Middleware de manejo de errores
app.use(errorMiddleware);

// Conectar a MongoDB y luego iniciar el servidor
connectDB().then(() => {
    app.use('/api', mainRoute);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
});