// /controllers/attendanceController.js
const attendanceService = require('../services/attendanceService');

// Controlador para registrar una nueva asistencia (deducir entrada o salida)
const createAttendance = async (req, res) => {
    try {
        const { uuid, zoneId } = req.body; // Solo enviamos el UUID y el zoneId
        const io = req.app.get('socketio');
        const newAttendance = await attendanceService.createAttendance({ uuid, zoneId },io);
        res.status(201).json(newAttendance);
    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
};

// Controlador para listar las asistencias por usuario
const getAttendanceByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const attendances = await attendanceService.getAttendanceByUser(userId);
        res.status(200).json(attendances);
    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
};

// Controlador para listar las asistencias por zona
const getAttendanceByZone = async (req, res) => {
    try {
        const { zoneId } = req.params;
        const attendances = await attendanceService.getAttendanceByZone(zoneId);
        res.status(200).json(attendances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAttendance,
    getAttendanceByUser,
    getAttendanceByZone
};
