const express = require('express');
const router = express.Router();
const recoveryController = require('../controllers/recoveryController');

// Ruta para generar OTP
router.post('/generate-otp', recoveryController.generateOTP);

// Ruta para verificar OTP y cambiar la contraseña
router.post('/verify-otp', recoveryController.verifyOTP);

router.post("/password",recoveryController.changePasswordWithOTP)

module.exports = router;