const Categorias = require('../database/models/Categorias');

const crearCategorias = async (data) => {
  const nuevoCategorias = new Categorias(data);
  return await nuevoCategorias.save();
};

const listarCategorias = async () => {
  return await Categorias.find();
};

const obtenerCategoriasPorId = async (id) => {
  return await Categorias.findById(id);
};

const actualizarCategorias = async (id, data) => {
  return await Categorias.findByIdAndUpdate(id, data, { new: true });
};

const eliminarCategorias = async (id) => {
  return await Categorias.findByIdAndDelete(id);
};

module.exports = {
  crearCategorias,
  listarCategorias,
  obtenerCategoriasPorId,
  actualizarCategorias,
  eliminarCategorias,
};
