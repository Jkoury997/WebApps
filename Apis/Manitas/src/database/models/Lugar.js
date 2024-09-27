const mongoose = require('mongoose');
const Base = require('./Base');

const lugarSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  ciudad: { type: String, required: true },
  pais: { type: String, required: true },
  telefono: { type: String },
});

const Lugar = Base.discriminator('Lugar', lugarSchema);

module.exports = Lugar;
