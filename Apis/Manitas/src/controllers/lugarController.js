// controllers/lugarController.js
const lugarService = require('../services/lugarService');

const crearLugar = async (req, res, next) => {
  try {
    const lugar = await lugarService.crearLugar(req.body);
    res.status(201).json(lugar);
  } catch (error) {
    next(error);  // Manejo de errores
  }
};

const obtenerLugares = async (req, res, next) => {
  try {
    const lugares = await lugarService.listarLugares();
    res.status(200).json(lugares);
  } catch (error) {
    next(error);
  }
};

// Nueva función para obtener lugares por empresa
const obtenerLugaresPorEmpresa = async (req, res, next) => {
  try {
    const lugares = await lugarService.listarLugaresPorEmpresa(req.params.empresaId);
    if (!lugares || lugares.length === 0) {
      return res.status(404).json({ message: 'No se encontraron lugares para esta empresa' });
    }
    res.status(200).json(lugares);
  } catch (error) {
    next(error);
  }
};

const obtenerLugarPorId = async (req, res, next) => {
  try {
    const lugar = await lugarService.obtenerLugarPorId(req.params.id);
    if (!lugar) {
      return res.status(404).json({ message: 'Lugar no encontrado' });
    }
    res.status(200).json(lugar);
  } catch (error) {
    next(error);
  }
};

const editarLugar = async (req, res, next) => {
  try {
    const lugarActualizado = await lugarService.editarLugar(req.params.id, req.body);
    if (!lugarActualizado) {
      return res.status(404).json({ message: 'Lugar no encontrado' });
    }
    res.status(200).json(lugarActualizado);
  } catch (error) {
    next(error);
  }
};

const eliminarLugar = async (req, res, next) => {
  try {
    const lugarEliminado = await lugarService.eliminarLugar(req.params.id);
    if (!lugarEliminado) {
      return res.status(404).json({ message: 'Lugar no encontrado' });
    }
    res.status(200).json({ message: 'Lugar eliminado con éxito' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  crearLugar,
  obtenerLugares,
  obtenerLugaresPorEmpresa,  // Nueva función para obtener lugares por empresa
  obtenerLugarPorId,
  editarLugar,
  eliminarLugar,
};
