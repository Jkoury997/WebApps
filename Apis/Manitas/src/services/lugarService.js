// services/lugarService.js
const Lugar = require('../database/models/Lugar');

// Crear un nuevo lugar
const crearLugar = async (lugarData) => {
  const nuevoLugar = new Lugar(lugarData);
  return await nuevoLugar.save();
};

// Editar un lugar existente
const editarLugar = async (lugarId, lugarData) => {
  return await Lugar.findByIdAndUpdate(lugarId, lugarData, { new: true });
};

// Eliminar un lugar
const eliminarLugar = async (lugarId) => {
  return await Lugar.findByIdAndDelete(lugarId);
};

// Obtener un lugar por ID
const obtenerLugarPorId = async (lugarId) => {
  return await Lugar.findById(lugarId);
};

// Listar todos los lugares
const listarLugares = async () => {
  return await Lugar.find();
};

// Nueva función para listar los lugares por empresa
const listarLugaresPorEmpresa = async (empresaId) => {
  return await Lugar.find({ empresa: empresaId });
};

module.exports = {
  crearLugar,
  editarLugar,
  eliminarLugar,
  obtenerLugarPorId,
  listarLugares,
  listarLugaresPorEmpresa,  // Nueva función para filtrar por empresa
};
