const Tarea = require('../database/models/Tareas');
const Categoria = require('../database/models/Categoria');
const Lugar = require('../database/models/Lugar');

// Crear una nueva tarea
const crearTarea = async (tareaData) => {
  const nuevaTarea = new Tarea(tareaData);
  return await nuevaTarea.save();
};

// Completar una tarea y agregar imagen "después"
const completarTarea = async (tareaId, imagenDespues,nota,realizadoPor) => {
  return await Tarea.findByIdAndUpdate(
    tareaId,
    { imagenDespues, completada: true, fechaCompletada: Date.now(),nota,realizadoPor },
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

// Listar todas las tareas por empresa, incluyendo nombres de categoría y lugar
const listarTareasPorEmpresa = async (empresaId) => {
  try {
    const tareas = await Tarea.find({ empresa: empresaId })
      .populate('categoria', 'titulo') // Poblar el campo 'categoria' con su título
      .populate('lugar', 'nombre'); // Poblar el campo 'lugar' con su nombre

    return tareas;
  } catch (error) {
    console.error('Error al listar tareas por empresa:', error);
    throw error;
  }
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
