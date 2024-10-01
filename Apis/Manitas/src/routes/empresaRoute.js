// routes/empresaRoutes.js
const express = require('express');
const empresaController = require('../controllers/empresaController');
const router = express.Router();

// Rutas para Empresa
router.post('/', empresaController.crearEmpresa); // Crear empresa
router.get('/', empresaController.obtenerEmpresas); // Obtener todas las empresas
router.get('/:id', empresaController.obtenerEmpresaPorId); // Obtener empresa por ID
router.put('/:id', empresaController.editarEmpresa); // Actualizar empresa
router.delete('/:id', empresaController.eliminarEmpresa); // Eliminar empresa

module.exports = router;
