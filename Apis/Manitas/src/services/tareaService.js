const Tarea = require('../database/models/Tareas');

// Crear una nueva tarea
const crearTarea = async (tareaData) => {
  const nuevaTarea = new Tarea(tareaData);
  return await nuevaTarea.save();
};

// Completar una tarea y agregar imagen "después"
const completarTarea = async (tareaId, imagenDespues) => {
  return await Tarea.findByIdAndUpdate(
    tareaId,
    { imagenDespues, completada: true, fechaCompletada: Date.now() },
    { new: true }
  );
};

// Obtener una tarea por ID
const obtenerTareaPorId = async (tareaId) => {
  return await Tarea.findById(tareaId);
};

// Listar todas las tareas
const listarTareas = async () => {
  return await Tarea.find();
};

// Listar tareas por tienda
const listarTareasPorLugar = async (lugarId) => {
  return await Tarea.find({ lugar: lugarId });
};

// Listar tareas por rubro
const listarTareasPorRubro = async (rubro) => {
  return await Tarea.find({ rubro });
};

// **Listar tareas por empresa**
const listarTareasPorEmpresa = async (empresaId) => {
  return await Tarea.find({ empresa: empresaId });
};

// Eliminar una tarea
const eliminarTarea = async (tareaId) => {
  return await Tarea.findByIdAndDelete(tareaId);
};

module.exports = {
  crearTarea,
  completarTarea,
  obtenerTareaPorId,
  listarTareas,
  listarTareasPorLugar,
  listarTareasPorRubro,
  listarTareasPorEmpresa, // Nueva función para buscar por empresa
  eliminarTarea,
};
