// /routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Ruta para registrar una nueva asistencia (entrada o salida) usando UUID
router.post('/', attendanceController.createAttendance);

// Ruta para obtener asistencias por usuario
router.get('/user/:userId', attendanceController.getAttendanceByUser);

// Ruta para obtener asistencias por zona
router.get('/zone/:zoneId', attendanceController.getAttendanceByZone);

module.exports = router;
