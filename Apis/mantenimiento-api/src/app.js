const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const conectarDB = require("./config/db"); // Conexión a MongoDB
const errorHandler = require("./middlewares/errorHandler");
require("./utils/createUploadsFolder"); // ✅ Importa y ejecuta la función

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const mainRoute = require("./routes/mainRoute");

// Inicializar aplicación Express
const app = express();

// Conectar a la base de datos
conectarDB();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Configurar rutas
app.use("/api", mainRoute);

// Middleware de manejo de errores (después de las rutas)
app.use(errorHandler);

module.exports = app;
