const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const lugarSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 }, // Usar UUID como identificador
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  barrio: { type: String, required: true },
  ciudad: { type: String, required: true },
  pais: { type: String, required: true },
  telefono: { type: String },
  empresa: { type: String, ref: 'Empresa', required: true }, // Referencia a la empresa por su UUID
});

const Lugar = mongoose.model('Lugar', lugarSchema);

module.exports = Lugar;
