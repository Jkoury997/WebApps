const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const EmpresaSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    nombre: { type: String, required: true, unique: true },
    zonas: [{ type: String, ref: "Zona" }]
}, { timestamps: true, _id: false });

module.exports = mongoose.model("Empresa", EmpresaSchema);
