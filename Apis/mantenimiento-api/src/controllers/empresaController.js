const empresaService = require("../services/empresaService");

exports.crearEmpresa = async (req, res) => {
    try {
        
        const empresa = await empresaService.crearEmpresa(req.body.nombre);
        res.status(201).json(empresa);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.obtenerEmpresas = async (req, res) => {
    try {
        res.json(await empresaService.obtenerEmpresas());
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.editarEmpresa = async (req, res) => {
    try {
        
        const empresa = await empresaService.editarEmpresa(req.params.id, req.body.nombre);
        res.json(empresa);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.eliminarEmpresa = async (req, res) => {
    try {
        await empresaService.eliminarEmpresa(req.params.id);
        res.json({ msg: "Empresa eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
