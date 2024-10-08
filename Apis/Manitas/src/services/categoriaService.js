// services/categoriaService.js
const Categoria = require('../database/models/Categoria');

// Crear una nueva categoría
const crearCategoria = async (categoriaData) => {
  const nuevaCategoria = new Categoria(categoriaData);
  return await nuevaCategoria.save();
};

// Editar una categoría existente
const editarCategoria = async (categoriaId, categoriaData) => {
  return await Categoria.findByIdAndUpdate(categoriaId, categoriaData, { new: true });
};

// Eliminar una categoría
const eliminarCategoria = async (categoriaId) => {
  return await Categoria.findByIdAndDelete(categoriaId);
};

// Obtener una categoría por ID
const obtenerCategoriaPorId = async (categoriaId) => {
  return await Categoria.findById(categoriaId);
};

// Listar todas las categorías
const listarCategorias = async () => {
  return await Categoria.find();
};

// Nueva función para listar los lugares por empresa
const listarCategoriasPorEmpresa = async (empresaId) => {
  return await Categoria.find({ empresa: empresaId });
};

module.exports = {
  crearCategoria,
  editarCategoria,
  eliminarCategoria,
  obtenerCategoriaPorId,
  listarCategorias,
  listarCategoriasPorEmpresa
};
