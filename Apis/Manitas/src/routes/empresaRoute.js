// routes/empresaRoutes.js
const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

// Rutas para manejar empresas
router.post('/crear', empresaController.crearEmpresa); // Crear empresa
router.put('/editar/:id', empresaController.editarEmpresa); // Editar empresa
router.delete('/eliminar/:id', empresaController.eliminarEmpresa); // Eliminar empresa
router.get('/listar', empresaController.listarEmpresas); // Listar todas las empresas
router.get('/:id', empresaController.obtenerEmpresaPorId); // Obtener una empresa por ID

module.exports = router;
