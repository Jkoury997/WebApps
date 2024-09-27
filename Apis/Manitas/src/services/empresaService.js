// services/empresaService.js
const Empresa = require('../database/models/Empresa');

// Crear una nueva empresa
const crearEmpresa = async (empresaData) => {
  const nuevaEmpresa = new Empresa(empresaData);
  return await nuevaEmpresa.save();
};

// Editar una empresa existente
const editarEmpresa = async (empresaId, empresaData) => {
  return await Empresa.findByIdAndUpdate(empresaId, empresaData, { new: true });
};

// Eliminar una empresa
const eliminarEmpresa = async (empresaId) => {
  return await Empresa.findByIdAndDelete(empresaId);
};

// Obtener una empresa por ID
const obtenerEmpresaPorId = async (empresaId) => {
  return await Empresa.findById(empresaId);
};

// Listar todas las empresas
const listarEmpresas = async () => {
  return await Empresa.find();
};

module.exports = {
  crearEmpresa,
  editarEmpresa,
  eliminarEmpresa,
  obtenerEmpresaPorId,
  listarEmpresas,
};
