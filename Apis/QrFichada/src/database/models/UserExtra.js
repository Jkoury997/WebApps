const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Importamos el generador de UUID
const userExtraSchema = new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
        unique: true,
      },
      workGroupId: {
        type: String, // UUID del WorkGroup
        ref: 'WorkGroup', // Relación con el modelo WorkGroup
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
  
  module.exports = mongoose.model('UserExtra', userExtraSchema);
  