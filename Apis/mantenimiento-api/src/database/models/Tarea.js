const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const estadosValidos = ["Creada", "Pendiente", "Realizada", "Supervisión", "Finalizada"];

const TareaSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
    estado: { type: String, enum: estadosValidos, default: estadosValidos[0] },
    ubicacionExpecifica: { type: String, required: true },
    imagenes: { type: [String], default: [] }, // Asegura que siempre sea un array
    zona: { type: String, ref: "Zona", required: true },
    tiempoInicio: { type: Date, default: Date.now },
    tiempoFin: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Tarea", TareaSchema);
