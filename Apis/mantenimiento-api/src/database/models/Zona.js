const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ZonaSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    nombre: { type: String, required: true },
    empresa: { type: String, ref: "Empresa", required: true },
    tareas: [{ type: String, ref: "Tarea" }]
}, { timestamps: true, _id: false });

module.exports = mongoose.model("Zona", ZonaSchema);
