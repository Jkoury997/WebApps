const express = require('express');
const lugarRoute = require("./lugarRoute");
const tareaRoute = require("./tareaRoute");
const categoriasRoute = require("./categoriasRoute");
const empresaRoute = require("./empresaRoute")

const router = express.Router();

// Configurar rutas base para cada conjunto de rutas
router.use('/lugares', lugarRoute);
router.use('/tareas', tareaRoute);
router.use('/categorias', categoriasRoute);
router.use('/empresas', empresaRoute)

module.exports = router;
