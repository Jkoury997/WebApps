const express = require('express');
const router = express.Router();
const trustDeviceController = require('../controllers/trustDeviceController');

// Ruta para registrar un dispositivo de confianza
router.post('/register', trustDeviceController.registerTrustedDevice);

// Ruta para verificar si un dispositivo es de confianza
router.post('/verify', trustDeviceController.verifyTrustedDevice);

// Ruta para actualizar un dispositivo de confianza con OTP
router.post('/update-device', trustDeviceController.updateDeviceWithOTP);

module.exports = router;