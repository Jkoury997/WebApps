const Tarea = require('../database/models/Tareas');

const crearTarea = async (data) => {
  const nuevaTarea = new Tarea(data);
  return await nuevaTarea.save();
};

const completarTarea = async (id, data) => {
  return await Tarea.findByIdAndUpdate(id, data, { new: true });
};

const obtenerTareaPorId = async (id) => {
  return await Tarea.findById(id);
};

const eliminarTarea = async (id) => {
  return await Tarea.findByIdAndDelete(id);
};

const listarTareasPorTienda = async (tienda) => {
  return await Tarea.find({ tienda });
};

const listarTareasPorRubro = async (rubro) => {
  return await Tarea.find({ rubro });
};

const listarTareas = async () => {
  return await Tarea.find();
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
