const Lugar = require('../database/models/Lugar');

const crearLugar = async (data) => {
  const nuevoLugar = new Lugar(data);
  return await nuevoLugar.save();
};

const listarLugares = async () => {
  return await Lugar.find();
};

const obtenerLugarPorId = async (id) => {
  return await Lugar.findById(id);
};

const actualizarLugar = async (id, data) => {
  return await Lugar.findByIdAndUpdate(id, data, { new: true });
};

const eliminarLugar = async (id) => {
  return await Lugar.findByIdAndDelete(id);
};

module.exports = {
  crearLugar,
  listarLugares,
  obtenerLugarPorId,
  actualizarLugar,
  eliminarLugar,
};
