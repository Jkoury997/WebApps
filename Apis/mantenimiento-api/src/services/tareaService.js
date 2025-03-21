const Tarea = require("../database/models/Tarea");
const Zona = require("../database/models/Zona");

exports.crearTarea = async (descripcion, categoria, zona,nombre,ubicacionExpecifica) => {
    const zonaExistente = await Zona.findById(zona);
    if (!zonaExistente) throw new Error("Zona no encontrada");

    const tarea = new Tarea({ descripcion, categoria, zona,nombre,ubicacionExpecifica });
    await tarea.save();

    zonaExistente.tareas.push(tarea._id);
    await zonaExistente.save();

    return tarea;
};

exports.obtenerTareas = async () => {
    return await Tarea.find().populate("zona");
};

exports.obtenerTareasEmpresa = async (id) => {
    return await Zona.findById(id).populate("tareas");
};



exports.editarTarea = async (id, descripcion, categoria) => {
    const tarea = await Tarea.findById(id);
    if (!tarea) throw new Error("Tarea no encontrada");

    if (descripcion) tarea.descripcion = descripcion;
    if (categoria) tarea.categoria = categoria;

    await tarea.save();
    return tarea;
};

exports.actualizarEstadoTarea = async (id, estado) => {
    const tarea = await Tarea.findById(id);
    if (!tarea) throw new Error("Tarea no encontrada");

    const estadosValidos = ["Creada", "Pendiente", "Realizada", "Supervisión", "Finalizada"];
    if (!estadosValidos.includes(estado)) throw new Error("Estado inválido");

    tarea.estado = estado;
    if (estado === "Finalizada") tarea.tiempoFin = new Date();

    await tarea.save();
    return tarea;
};

exports.eliminarTarea = async (id) => {
    const tarea = await Tarea.findById(id);
    if (!tarea) throw new Error("Tarea no encontrada");

    await tarea.deleteOne();
};

exports.reporteTiempos = async () => {
    const tareas = await Tarea.find({ estado: "Finalizada" });

    return tareas.map(tarea => {
        const tiempoTotal = (new Date(tarea.tiempoFin) - new Date(tarea.tiempoInicio)) / 1000; // en segundos
        return { descripcion: tarea.descripcion, tiempoTotal };
    });
};

// 📌 Subir Evidencia
exports.subirEvidencia = async (id, archivos) => {
    const tarea = await Tarea.findById(id);
    if (!tarea) throw new Error("Tarea no encontrada");

    if (!archivos || archivos.length === 0) throw new Error("Debe subir al menos una imagen");

    const imagenesSubidas = archivos.map(file => `/uploads/${file.filename}`);
    tarea.imagenes.push(...imagenesSubidas);
    await tarea.save();

    return imagenesSubidas;
};
