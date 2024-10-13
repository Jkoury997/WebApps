const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const qrCodeSchema = new mongoose.Schema({
    userId: { type: String, required: true },  // Cambiar a String para UUIDs
    uuid: { type: String, default: uuidv4 },   // Generar automáticamente un UUID
    expiresAt: { type: Date, required: true }, // Fecha de expiración del QR
}, { timestamps: true });

// Índice TTL para eliminar el documento 30 segundos después de que expire
qrCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 30 });

module.exports = mongoose.model('QrCode', qrCodeSchema);
