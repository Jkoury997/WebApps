const lugarService = require('../services/lugarService');

const crearLugar = async (req, res, next) => {
  try {
    // Validación básica de los datos recibidos
    if (!req.body.nombre || !req.body.direccion) {
      return res.status(400).json({ error: 'El nombre y la dirección son requeridos' });
    }

    const lugar = await lugarService.crearLugar(req.body);
    res.status(201).json(lugar);
  } catch (error) {
    next(error);  // Pasa el error al middleware de manejo de errores
  }
};

const listarLugares = async (req, res, next) => {
  try {
    const lugares = await lugarService.listarLugares();
    res.status(200).json({ lugares }); 
  } catch (error) {
    next(error);
  }
};

const obtenerLugarPorId = async (req, res, next) => {
  try {
    const lugar = await lugarService.obtenerLugarPorId(req.params.id);

    // Si no se encuentra el lugar, se responde con un 404
    if (!lugar) {
      return res.status(404).json({ error: 'Lugar no encontrado' });
    }

    res.status(200).json(lugar);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID de lugar inválido' });
    }
    next(error);
  }
};

const actualizarLugar = async (req, res, next) => {
  try {
    const lugar = await lugarService.actualizarLugar(req.params.id, req.body);

    // Si no se encuentra el lugar, se responde con un 404
    if (!lugar) {
      return res.status(404).json({ error: 'Lugar no encontrado' });
    }

    res.status(200).json(lugar);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID de lugar inválido' });
    }
    next(error);
  }
};

const eliminarLugar = async (req, res, next) => {
  try {
    const lugar = await lugarService.eliminarLugar(req.params.id);

    // Si no se encuentra el lugar, se responde con un 404
    if (!lugar) {
      return res.status(404).json({ error: 'Lugar no encontrado' });
    }

    res.status(200).json({ message: 'Lugar eliminado' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID de lugar inválido' });
    }
    next(error);
  }
};

module.exports = {
  crearLugar,
  listarLugares,
  obtenerLugarPorId,
  actualizarLugar,
  eliminarLugar,
};
