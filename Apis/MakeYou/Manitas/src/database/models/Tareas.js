const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const tareaSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },  // Usar UUID como identificador
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  rubro: { type: String, required: true },  // Por ejemplo, 'electricidad', 'pintura', etc.
  lugar: { type: String, required: true },  // La tienda a la que pertenece la tarea
  imagenAntes: { type: String, required: true },  // Ruta de la imagen del "antes"
  imagenDespues: { type: String },  // Ruta a la imagen después de realizar la tarea
  fechaCreacion: { type: Date, default: Date.now },  // Fecha en que se creó la tarea
  fechaCompletada: { type: Date },  // Fecha en que se completó la tarea
  completada: { type: Boolean, default: false },  // Estado de la tarea
  creadoPor: { type: String, required: true },  // Nombre de quien creó la tarea
  realizadoPor: { type: String },  // Nombre de quien completó la tarea
});

const Tarea = mongoose.model('Tarea', tareaSchema);

module.exports = Tarea;
