require('dotenv').config();
const mongoose = require('mongoose');

const heartbeatSchema = new mongoose.Schema({
  sn: { type: String, required: true },            // Número de serie del sensor
  receivingPower: { type: Number, required: true }, // Nivel de batería del receptor
  transmissionPower: { type: Number, required: true }, // Nivel de batería del transmisor
  codeStatus: { type: Number, required: true },     // Estado del código
  version: { type: String, required: true },       // Versión del software
}, { timestamps: true });  // Agrega `createdAt` y `updatedAt` automáticamente

const Heartbeat = mongoose.model('Heartbeat', heartbeatSchema);

module.exports = Heartbeat;
