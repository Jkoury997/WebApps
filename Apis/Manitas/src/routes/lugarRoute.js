// routes/lugarRoutes.js
const express = require('express');
const lugarController = require('../controllers/lugarController');
const router = express.Router();

// Rutas para Lugar
router.post('/', lugarController.crearLugar); // Crear lugar
router.get('/', lugarController.obtenerLugares); // Obtener todos los lugares
router.get('/:id', lugarController.obtenerLugarPorId); // Obtener lugar por ID
router.get('/empresa/:empresaId', lugarController.obtenerLugaresPorEmpresa); // Obtener lugares por empresa
router.put('/:id', lugarController.editarLugar); // Actualizar lugar
router.delete('/:id', lugarController.eliminarLugar); // Eliminar lugar

module.exports = router;
