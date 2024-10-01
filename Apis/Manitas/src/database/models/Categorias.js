const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const categoriasSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 }, // Usar UUID como identificador
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  creadoPor: { type: String, required: true },
  empresa: { type: String, ref: 'Empresa', required: true } // Referencia a la empresa por su UUID
});

const Categorias = mongoose.model('Categorias', categoriasSchema);

module.exports = Categorias;
