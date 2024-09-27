// controllers/empresaController.js
const empresaService = require('../services/empresaService');

// Controlador para crear una empresa
const crearEmpresa = async (req, res) => {
  try {
    const empresaData = req.body;
    const nuevaEmpresa = await empresaService.crearEmpresa(empresaData);
    res.status(201).json({ message: 'Empresa creada con éxito', empresa: nuevaEmpresa });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la empresa', error: error.message });
  }
};

// Controlador para editar una empresa
const editarEmpresa = async (req, res) => {
  try {
    const empresaId = req.params.id;
    const empresaData = req.body;
    const empresaActualizada = await empresaService.editarEmpresa(empresaId, empresaData);
    if (!empresaActualizada) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }
    res.status(200).json({ message: 'Empresa actualizada con éxito', empresa: empresaActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al editar la empresa', error: error.message });
  }
};

// Controlador para eliminar una empresa
const eliminarEmpresa = async (req, res) => {
  try {
    const empresaId = req.params.id;
    const empresaEliminada = await empresaService.eliminarEmpresa(empresaId);
    if (!empresaEliminada) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }
    res.status(200).json({ message: 'Empresa eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la empresa', error: error.message });
  }
};

// Controlador para obtener una empresa por ID
const obtenerEmpresaPorId = async (req, res) => {
  try {
    const empresaId = req.params.id;
    const empresa = await empresaService.obtenerEmpresaPorId(empresaId);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }
    res.status(200).json(empresa);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la empresa', error: error.message });
  }
};

// Controlador para listar todas las empresas
const listarEmpresas = async (req, res) => {
  try {
    const empresas = await empresaService.listarEmpresas();
    res.status(200).json(empresas);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar las empresas', error: error.message });
  }
};

module.exports = {
  crearEmpresa,
  editarEmpresa,
  eliminarEmpresa,
  obtenerEmpresaPorId,
  listarEmpresas,
};
