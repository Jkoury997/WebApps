const express = require('express');
const connectDB = require('./database/db');
const mainRoute = require('./routes/mainRoute');
const morgan = require('morgan');
const cors = require('cors');
const path = require("path")
const errorMiddleware = require("./middlewares/errorMiddleware")
const fs = require('fs'); // Importa el módulo fs
require('dotenv').config();





const app = express();
const PORT = process.env.PORT || 3000;

// Verifica si la carpeta uploads existe, si no, la crea
const uploadsPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true }); // Crea la carpeta y las subcarpetas si no existen
}

// Configura la carpeta uploads como pública
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware
// Middleware con límite de tamaño aumentado
app.use(express.json({ limit: '50mb' })); // Límite para JSON
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Límite para datos de formularios
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