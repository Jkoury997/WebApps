// /routes/zoneRoutes.js
const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zoneController');

// Middleware
const verifyEmpresaMiddleware = require('../middlewares/verifyEmpresaMiddleware');

// Ruta para crear una nueva zona de fichada
router.post('/', verifyEmpresaMiddleware, zoneController.createZone);

// Ruta para obtener todas las zonas de una empresa
router.get('/:empresaId', zoneController.getZonesByEmpresa);

// Ruta para vincular una zona con un trustdevice
router.post('/link', zoneController.linkZoneWithTrustDevice);

// Ruta para obtener una zona por trustdevice
router.get('/trustdevice/:trustdevice', zoneController.getZoneByTrustDevice);

// Nueva ruta para eliminar una zona por ID
router.delete('/:id', zoneController.deleteZone);

module.exports = router;
