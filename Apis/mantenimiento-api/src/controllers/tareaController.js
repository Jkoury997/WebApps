const tareaService = require("../services/tareaService");

exports.crearTarea = async (req, res) => {
    try {
        const tarea = await tareaService.crearTarea(req.body.descripcion, req.body.categoria, req.body.zona,req.body.nombre,req.body.ubicacionExpecifica);
        res.status(201).json(tarea);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.obtenerTareas = async (req, res) => {
    try {
        res.json(await tareaService.obtenerTareas());
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.obtenerTareasEmpresa = async (req, res) => {
    try {
        
        res.json(await tareaService.obtenerTareasEmpresa(req.params.id));
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.editarTarea = async (req, res) => {
    try {
        const tarea = await tareaService.editarTarea(req.params.id, req.body.descripcion, req.body.categoria);
        res.json(tarea);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.actualizarEstadoTarea = async (req, res) => {
    try {
        const tarea = await tareaService.actualizarEstadoTarea(req.params.id, req.body.estado);
        res.json({ msg: "Estado actualizado", tarea });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.eliminarTarea = async (req, res) => {
    try {
        await tareaService.eliminarTarea(req.params.id);
        res.json({ msg: "Tarea eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.reporteTiempos = async (req, res) => {
    try {
        res.json(await tareaService.reporteTiempos());
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// 📌 Controlador para subir evidencia
exports.subirEvidencia = async (req, res) => {
    try {
        const imagenesSubidas = await tareaService.subirEvidencia(req.params.id, req.files);
        res.status(200).json({ msg: "Evidencia subida correctamente", imagenes: imagenesSubidas });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
