const zonaService = require("../services/zonaService");

exports.crearZona = async (req, res) => {
    try {
        res.status(201).json(await zonaService.crearZona(req.body.nombre, req.body.empresa));
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.obtenerZonas = async (req, res) => {
    try {
        res.json(await zonaService.obtenerZonas());
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


exports.obtenerZonasEmpresa = async (req, res) => {
    try {
        res.json(await zonaService.obtenerZonasEmpresa(req.params.id));
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


exports.editarZona = async (req, res) => {
    try {
        res.json(await zonaService.editarZona(req.params.id, req.body.nombre));
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.eliminarZona = async (req, res) => {
    try {
        await zonaService.eliminarZona(req.params.id);
        res.json({ msg: "Zona eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
