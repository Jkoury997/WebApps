// routes/categoriaRoutes.js
const express = require('express');
const categoriaController = require('../controllers/categoriaController');
const router = express.Router();

// Rutas para Categoría
router.post('/', categoriaController.crearCategoria); // Crear categoría
router.get('/', categoriaController.obtenerCategorias); // Obtener todas las categorías
router.get('/:id', categoriaController.obtenerCategoriaPorId); // Obtener categoría por ID
router.get('/empresa/:empresaId', categoriaController.obtenerCategoriasPorEmpresa); // Obtener lugares por empresa
router.put('/:id', categoriaController.editarCategoria); // Actualizar categoría
router.delete('/:id', categoriaController.eliminarCategoria); // Eliminar categoría

module.exports = router;
