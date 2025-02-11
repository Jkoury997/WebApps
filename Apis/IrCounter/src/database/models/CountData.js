require('dotenv').config();
const mongoose = require('mongoose');

const countSchema = new mongoose.Schema({
  sn: { type: String, required: true },             // Número de serie del sensor
  inCount: { type: Number, required: true },        // Personas que entraron
  outCount: { type: Number, required: true },       // Personas que salieron
  receivingPower: { type: Number, required: true }, // Nivel de batería del receptor
  transmissionPower: { type: Number, required: true }, // Nivel de batería del transmisor
  codeStatus: { type: Number, required: true },     // Estado del código
  version: { type: String, required: true },       // Versión del software
}, { timestamps: true });  // Agrega `createdAt` y `updatedAt` automáticamente

const CountData = mongoose.model('CountData', countSchema);

module.exports = CountData;
