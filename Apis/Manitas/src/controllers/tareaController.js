const tareaService = require('../services/tareaService');

// Crear una nueva tarea con imagen "antes"
const crearTarea = async (req, res, next) => {
  try {
    const { titulo, descripcion, categoria, lugar, empresa, creadoPor } = req.body;

    const imagenAntes = req.file ? req.file.filename : null;

    const tarea = await tareaService.crearTarea({
      titulo,
      descripcion,
      categoria,
      lugar,
      empresa,
      creadoPor,
      imagenAntes,
    });

    res.status(201).json(tarea);
  } catch (error) {
    next(error);
  }
};

// Completar una tarea con imagen "después"
const completarTarea = async (req, res, next) => {
  try {
    const imagenDespues = req.file ? req.file.filename : null;
    const tareaId = req.params.id;

    const tareaCompletada = await tareaService.completarTarea(tareaId, imagenDespues);

    if (!tareaCompletada) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.status(200).json(tareaCompletada);
  } catch (error) {
    next(error);
  }
};

// Obtener una tarea por ID
const obtenerTareaPorId = async (req, res, next) => {
  try {
    const tarea = await tareaService.obtenerTareaPorId(req.params.id);
    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(200).json(tarea);
  } catch (error) {
    next(error);
  }
};

// Listar tareas por tienda
const listarTareasPorLugar= async (req, res, next) => {
  try {
    const tareas = await tareaService.listarTareasPorLugar(req.params.lugar);
    res.status(200).json(tareas);
  } catch (error) {
    next(error);
  }
};

// Listar tareas por rubro
const listarTareasPorRubro = async (req, res, next) => {
  try {
    const tareas = await tareaService.listarTareasPorRubro(req.params.rubro);
    res.status(200).json(tareas);
  } catch (error) {
    next(error);
  }
};

// **Listar tareas por empresa**
const listarTareasPorEmpresa = async (req, res, next) => {
  try {
    const tareas = await tareaService.listarTareasPorEmpresa(req.params.empresa);
    res.status(200).json(tareas);
  } catch (error) {
    next(error);
  }
};

// Eliminar una tarea
const eliminarTarea = async (req, res, next) => {
  try {
    const tareaEliminada = await tareaService.eliminarTarea(req.params.id);
    if (!tareaEliminada) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(200).json({ message: 'Tarea eliminada con éxito' });
  } catch (error) {
    next(error);
  }
};

// Listar todas las tareas
const listarTareas = async (req, res, next) => {
  try {
    const tareas = await tareaService.listarTareas();
    res.status(200).json(tareas);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  crearTarea,
  completarTarea,
  obtenerTareaPorId,
  listarTareasPorLugar,
  listarTareasPorRubro,
  listarTareasPorEmpresa, // Nueva función para listar por empresa
  eliminarTarea,
  listarTareas,
};
