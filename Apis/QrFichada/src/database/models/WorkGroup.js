const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const workGroupSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // Usamos String como identificador principal
      default: uuidv4, // Genera automáticamente un UUID único
    },
    name: {
      type: String,
      required: true, // Nombre del grupo de trabajo (ej. Full Time, Part Time 6 horas)
    },
    workHours: {
      type: Number, // Número de horas asignadas al grupo
      required: true, // Obligatorio para cada grupo de trabajo
    },
    empresaId: {
      type: String, // UUID de la empresa asociada
      required: true, // Es obligatorio vincular a una empresa
      ref: 'Empresa', // Relación con la tabla Empresa
    },
  },
  {
    timestamps: true, // Incluye createdAt y updatedAt automáticamente
  }
);

module.exports = mongoose.model('WorkGroup', workGroupSchema);
