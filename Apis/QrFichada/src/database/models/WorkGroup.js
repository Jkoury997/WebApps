const { v4: uuidv4 } = require('uuid'); // Importa la librería UUID
const mongoose = require('mongoose');

const workGroupSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4, // Genera un UUID automáticamente
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    allowedHours: {
      type: [Number],
      required: true,
      validate: {
        validator: function (hours) {
          return hours.every((hour) => hour > 0 && hour <= 24);
        },
        message: 'Las horas permitidas deben estar entre 1 y 24.',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    empresId: { type: String, required: true, ref: 'Empresa' },
  },
  {
    timestamps: true,
  }
);

// Métodos personalizados
workGroupSchema.methods.isHourAllowed = function (hour) {
  return this.allowedHours.includes(hour);
};

module.exports = mongoose.model('WorkGroup', workGroupSchema);

