const mongoose = require('mongoose');
const Base = require('./Base');

const categoriasSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  creadoPor: { type: String, required: true },
});

const Categorias = Base.discriminator('Categorias', categoriasSchema);

module.exports = Categorias;
