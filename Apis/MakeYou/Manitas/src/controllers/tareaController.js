const tareaService = require('../services/tareaService');

const crearTarea = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('La imagen del "antes" es obligatoria');
    }

    const data = {
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      rubro: req.body.rubro,
      tienda: req.body.tienda,
      creadoPor: req.body.creadoPor,
      imagenAntes: req.file.path,
    };

    const tarea = await tareaService.crearTarea(data);
    res.status(201).json(tarea);
  } catch (error) {
    next(error);
  }
};

const completarTarea = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('La imagen del "después" es obligatoria');
    }

    const data = {
      realizadoPor: req.body.realizadoPor,
      imagenDespues: req.file.path,
      fechaCompletada: Date.now(),
      completada: true,
    };

    const tarea = await tareaService.completarTarea(req.params.id, data);

    if (!tarea) {
      res.status(404);
      throw new Error('Tarea no encontrada');
    }

    res.status(200).json(tarea);
  } catch (error) {
    next(error);
  }
};

const obtenerTareaPorId = async (req, res, next) => {
  try {
    const tarea = await tareaService.obtenerTareaPorId(req.params.id);
    if (!tarea) {
      res.status(404);
      throw new Error('Tarea no encontrada');
    }
    res.status(200).json(tarea);
  } catch (error) {
    next(error);
  }
};

const eliminarTarea = async (req, res, next) => {
  try {
    const tarea = await tareaService.eliminarTarea(req.params.id);
    if (!tarea) {
      res.status(404);
      throw new Error('Tarea no encontrada');
    }
    res.status(200).json({ message: 'Tarea eliminada' });
  } catch (error) {
    next(error);
  }
};

const listarTareasPorTienda = async (req, res, next) => {
  try {
    const tareas = await tareaService.listarTareasPorTienda(req.params.tienda);
    res.status(200).json(tareas);
  } catch (error) {
    next(error);
  }
};

const listarTareasPorRubro = async (req, res, next) => {
  try {
    const tareas = await tareaService.listarTareasPorRubro(req.params.rubro);
    res.status(200).json(tareas);
  } catch (error) {
    next(error);
  }
};

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
  eliminarTarea,
  listarTareasPorTienda,
  listarTareasPorRubro,
  listarTareas,
};
