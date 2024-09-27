
const express = require('express');
const categoriaController = require('../controllers/categoriaController');

const router = express.Router();

router.post('/create', categoriaController.crearCategoria);
router.get('/list', categoriaController.listarCategorias);
router.get('/list/:id', categoriaController.obtenerCategoriaPorId);
router.put('/update/:id', categoriaController.actualizarCategoria);
router.delete('/delete/:id', categoriaController.eliminarCategoria);

module.exports = router;
