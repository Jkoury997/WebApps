const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');

// Middleware
const verifyUserMiddleware = require('../middlewares/verifyUserMiddleware');
const verifyFingerprintMiddleware = require('../middlewares/verifyFingerprintMiddleware');

// Ruta para generar un UUID vinculado al userId
router.post('/generate',verifyUserMiddleware,verifyFingerprintMiddleware, qrController.generateUUID);

// Ruta para verificar si un UUID es válido
router.get('/verify/:uuid', qrController.verifyUUID);

module.exports = router;
