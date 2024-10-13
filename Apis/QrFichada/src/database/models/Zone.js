const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const zoneSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },  // UUID único para la zona
    nombre: { type: String, required: true },   // Nombre de la zona
    empresaId: { type: String, required: true, ref: 'Empresa' }, // Relacionado con la empresa
    trustdevice: { type: String, default: null }, // Almacena el dispositivo de confianza si se vincula
}, { timestamps: true });

module.exports = mongoose.model('Zone', zoneSchema);
