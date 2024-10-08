const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const tareaSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 }, // Usar UUID como identificador
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, ref: 'Categoria', required: true }, 
  lugar: { type: String, ref: 'Lugar', required: true }, // Referencia a un lugar por su UUID
  empresa: { type: String, ref: 'Empresa', required: true }, // Referencia a la empresa por su UUID
  imagenAntes: { type: String, required: true },
  imagenDespues: { type: String },
  fechaCreada: { type: Date, default: Date.now }, // Fecha de creación automática
  fechaCompletada: { type: Date },
  fechaSupervisada: { type: Date },
  completada: { type: Boolean, default: false },
  supervisada: { type: Boolean, default: false },
  creadoPor: { type: String, required: true },
  realizadoPor: { type: String },
  supervisadoPor: { type: String },
  nota: { type: String },
  urgencia: { 
    type: String, 
    enum: ['baja', 'media', 'alta'], // Definimos los posibles valores
    required: true 
  }
});

const Tarea = mongoose.model('Tarea', tareaSchema);

module.exports = Tarea;
