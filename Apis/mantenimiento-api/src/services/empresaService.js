const Empresa = require("../database/models/Empresa");

exports.crearEmpresa = async (nombre) => {
    const empresa = new Empresa({ nombre });
    await empresa.save();
    return empresa;
};

exports.obtenerEmpresas = async () => {
    return await Empresa.find().populate("zonas");
};

exports.editarEmpresa = async (id, nombre) => {
    const empresa = await Empresa.findById(id);
    if (!empresa) throw new Error("Empresa no encontrada");

    if (nombre) empresa.nombre = nombre;


    await empresa.save();
    return empresa;
};

exports.eliminarEmpresa = async (id) => {
    const empresa = await Empresa.findById(id);
    if (!empresa) throw new Error("Empresa no encontrada");

    await empresa.deleteOne();
};
