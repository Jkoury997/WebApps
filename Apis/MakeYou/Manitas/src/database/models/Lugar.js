const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const lugarSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },  // Usar UUID como identificador
  nombre: { type: String, required: true },  // Nombre de la tienda
  direccion: { type: String, required: true },  // Dirección de la tienda
  ciudad: { type: String, required: true },  // Ciudad donde está ubicada la tienda
  pais: { type: String, required: true },  // País donde está ubicada la tienda
  telefono: { type: String },  // Teléfono de contacto de la tienda
});

const Lugar = mongoose.model('Lugar', lugarSchema);

module.exports = Lugar;