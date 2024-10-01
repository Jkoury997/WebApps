// controllers/categoriaController.js
const categoriaService = require('../services/categoriaService');

const crearCategoria = async (req, res, next) => {
  try {
    const categoria = await categoriaService.crearCategoria(req.body);
    res.status(201).json(categoria);
  } catch (error) {
    next(error);  // Manejo de errores
  }
};

const obtenerCategorias = async (req, res, next) => {
  try {
    const categorias = await categoriaService.listarCategorias();
    res.status(200).json(categorias);
  } catch (error) {
    next(error);
  }
};

const obtenerCategoriaPorId = async (req, res, next) => {
  try {
    const categoria = await categoriaService.obtenerCategoriaPorId(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.status(200).json(categoria);
  } catch (error) {
    next(error);
  }
};

// Nueva función para obtener lugares por empresa
const obtenerCategoriasPorEmpresa = async (req, res, next) => {
  try {
    const categorias = await categoriaService.listarCategoriasPorEmpresa(req.params.empresaId);
    if (!categorias  || categorias .length === 0) {
      return res.status(404).json({ message: 'No se encontraron lugares para esta empresa' });
    }
    res.status(200).json(categorias );
  } catch (error) {
    next(error);
  }
};

const editarCategoria = async (req, res, next) => {
  try {
    const categoriaActualizada = await categoriaService.editarCategoria(req.params.id, req.body);
    if (!categoriaActualizada) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.status(200).json(categoriaActualizada);
  } catch (error) {
    next(error);
  }
};

const eliminarCategoria = async (req, res, next) => {
  try {
    const categoriaEliminada = await categoriaService.eliminarCategoria(req.params.id);
    if (!categoriaEliminada) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.status(200).json({ message: 'Categoría eliminada con éxito' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  editarCategoria,
  eliminarCategoria,
  obtenerCategoriasPorEmpresa
};
