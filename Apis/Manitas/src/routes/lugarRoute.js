const express = require('express');
const lugarController = require('../controllers/lugarController');

const router = express.Router();

router.post('/create', lugarController.crearLugar);
router.get('/list', lugarController.listarLugares);
router.get('/list/:id', lugarController.obtenerLugarPorId);
router.put('/update/:id', lugarController.actualizarLugar);
router.delete('/delete/:id', lugarController.eliminarLugar);

module.exports = router;
