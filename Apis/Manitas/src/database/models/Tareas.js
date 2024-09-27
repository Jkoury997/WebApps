const mongoose = require('mongoose');
const Base = require('./Base');

const tareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  rubro: { type: String, required: true },
  lugar: { type: String, required: true },
  imagenAntes: { type: String, required: true },
  imagenDespues: { type: String },
  fechaCompletada: { type: Date },
  completada: { type: Boolean, default: false },
  creadoPor: { type: String, required: true },
  realizadoPor: { type: String },
});

const Tarea = Base.discriminator('Tarea', tareaSchema);

module.exports = Tarea;
