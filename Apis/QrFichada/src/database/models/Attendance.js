// /models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'User' }, // Referencia al usuario
    zoneId: { type: String, required: true, ref: 'Zone' }, // Referencia a la zona
    timestamp: { type: Date, default: Date.now }, // Fecha y hora de la asistencia
    type: { type: String, enum: ['entrada', 'salida'], required: true }, // Entrada o salida
    automaticClosure: { type: Boolean, default: false }, // Indica si fue un cierre automático
    hasAutomaticClosure: { type: Boolean, default: false } // Para evitar duplicados
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
