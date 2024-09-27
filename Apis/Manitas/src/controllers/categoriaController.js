const categoriaService = require('../services/categoriaService');

const crearCategoria = async (req, res, next) => {
  try {
    // Validación básica de los datos recibidos
    const categoria = await categoriaService.crearCategorias(req.body);
    res.status(201).json(categoria);
  } catch (error) {
    next(error);  // Pasa el error al middleware de manejo de errores
  }
};

const listarCategorias = async (req, res, next) => {
  try {
    const categorias = await categoriaService.listarCategorias();
    res.status(200).json({ categorias });
  } catch (error) {
    next(error);
  }
};

const obtenerCategoriaPorId = async (req, res, next) => {
  try {
    const categoria = await categoriaService.obtenerCategoriasPorId(req.params.id);

    // Si no se encuentra la categoría, se responde con un 404
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.status(200).json(categoria);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID de categoría inválido' });
    }
    next(error);
  }
};

const actualizarCategoria = async (req, res, next) => {
  try {
    const categoria = await categoriaService.actualizarCategorias(req.params.id, req.body);

    // Si no se encuentra la categoría, se responde con un 404
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.status(200).json(categoria);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID de categoría inválido' });
    }
    next(error);
  }
};

const eliminarCategoria = async (req, res, next) => {
  try {
    const categoria = await categoriaService.eliminarCategorias(req.params.id);

    // Si no se encuentra la categoría, se responde con un 404
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.status(200).json({ message: 'Categoría eliminada' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID de categoría inválido' });
    }
    next(error);
  }
};

module.exports = {
  crearCategoria,
  listarCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria,
};
