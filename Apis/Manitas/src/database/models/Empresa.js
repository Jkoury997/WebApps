const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const empresaSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 }, // Usar UUID como identificador
  idSistema: {type: Number, required: true },
  EmpresaSistema: { type: String, required: true },
  nombre: { type: String, required: true }, // Nombre de la empresa
  direccion: { type: String, required: true }, // Dirección de la empresa
  telefono: { type: String }, // Teléfono de la empresa
  email: { type: String, required: true }, // Email de contacto de la empresa
  fechaCreacion: { type: Date, default: Date.now }, // Fecha de creación
});

const Empresa = mongoose.model('Empresa', empresaSchema);

module.exports = Empresa;
