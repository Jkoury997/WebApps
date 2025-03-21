const Zona = require("../database/models/Zona");
const Empresa = require("../database/models/Empresa");

exports.crearZona = async (nombre, empresa) => {
    const empresaExistente = await Empresa.findById(empresa);
    if (!empresaExistente) throw new Error("Empresa no encontrada");

    const zona = new Zona({ nombre, empresa });
    await zona.save();
    empresaExistente.zonas.push(zona._id);
    await empresaExistente.save();
    return zona;
};

exports.obtenerZonas = async () => {
    return await Zona.find().populate("empresa");
};

exports.obtenerZonasEmpresa = async (id) => {
    return await Empresa.findById(id).populate("zonas");
};


exports.editarZona = async (id, nombre) => {
    const zona = await Zona.findById(id);
    if (!zona) throw new Error("Zona no encontrada");
    zona.nombre = nombre;
    await zona.save();
    return zona;
};

exports.eliminarZona = async (id) => {
    const zona = await Zona.findById(id);
    if (!zona) throw new Error("Zona no encontrada");
    await zona.deleteOne();
};
