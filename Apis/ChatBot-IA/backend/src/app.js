// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mainRoute = require('./src/routes/mainRoute.js');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', mainRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
