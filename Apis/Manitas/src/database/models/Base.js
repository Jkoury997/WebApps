const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const baseSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  empresa: { type: String, required: true },  // Campo común
  fechaCreacion: { type: Date, default: Date.now },  // Fecha de creación
}, { discriminatorKey: 'tipo' });  // Discriminator para diferentes tipos

const Base = mongoose.model('Base', baseSchema);

module.exports = Base;
