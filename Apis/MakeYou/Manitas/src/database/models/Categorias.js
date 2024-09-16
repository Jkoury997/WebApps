const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const categoriasSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },  // Usar UUID como identificador
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now },  // Fecha en que se creó la categorias
  creadoPor: { type: String, required: true },  // Nombre de quien creó la categorias
});

const Categorias = mongoose.model('Categorias', categoriasSchema);

module.exports = Categorias;
