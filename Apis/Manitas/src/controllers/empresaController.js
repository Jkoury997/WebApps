// controllers/empresaController.js
const empresaService = require('../services/empresaService');

const crearEmpresa = async (req, res, next) => {
  try {
    const empresa = await empresaService.crearEmpresa(req.body);
    res.status(201).json(empresa);
  } catch (error) {
    next(error);  // Manejo de errores
  }
};

const obtenerEmpresas = async (req, res, next) => {
  try {
    const empresas = await empresaService.listarEmpresas();
    res.status(200).json(empresas);
  } catch (error) {
    next(error);
  }
};

const obtenerEmpresaPorId = async (req, res, next) => {
  try {
    const empresa = await empresaService.obtenerEmpresaPorId(req.params.id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }
    res.status(200).json(empresa);
  } catch (error) {
    next(error);
  }
};

const editarEmpresa = async (req, res, next) => {
  try {
    const empresaActualizada = await empresaService.editarEmpresa(req.params.id, req.body);
    if (!empresaActualizada) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }
    res.status(200).json(empresaActualizada);
  } catch (error) {
    next(error);
  }
};

const eliminarEmpresa = async (req, res, next) => {
  try {
    const empresaEliminada = await empresaService.eliminarEmpresa(req.params.id);
    if (!empresaEliminada) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }
    res.status(200).json({ message: 'Empresa eliminada con éxito' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  crearEmpresa,
  obtenerEmpresas,
  obtenerEmpresaPorId,
  editarEmpresa,
  eliminarEmpresa,
};
