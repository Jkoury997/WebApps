const workGroupService = require('../services/workGroupService');

// Crear un nuevo WorkGroup
const createWorkGroup = async (req, res) => {
    try {
        const workGroup = await workGroupService.createWorkGroup(req.body);
        res.status(201).json(workGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los WorkGroups
const getAllWorkGroups = async (req, res) => {
    try {
        const workGroups = await workGroupService.getAllWorkGroups();
        res.status(200).json(workGroups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener todos los WorkGroups
const getWorkGroupsByEmpresaId = async (req, res) => {
    try {
        const { empresaId } = req.params;
        const workGroups = await workGroupService.getWorkGroupsByEmpresaId(empresaId);
        res.status(200).json(workGroups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un WorkGroup por ID
const getWorkGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        const workGroup = await workGroupService.getWorkGroupById(id);
        if (!workGroup) {
            return res.status(404).json({ message: 'No se encontró el grupo de trabajo.' });
        }
        res.status(200).json(workGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un WorkGroup por ID
const updateWorkGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedWorkGroup = await workGroupService.updateWorkGroupById(id, req.body);
        if (!updatedWorkGroup) {
            return res.status(404).json({ message: 'No se encontró el grupo de trabajo para actualizar.' });
        }
        res.status(200).json(updatedWorkGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un WorkGroup por ID
const deleteWorkGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await workGroupService.deleteWorkGroupById(id);
        if (!deleted) {
            return res.status(404).json({ message: 'No se encontró el grupo de trabajo para eliminar.' });
        }
        res.status(200).json({ message: 'Grupo de trabajo eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createWorkGroup,
    getAllWorkGroups,
    getWorkGroupById,
    updateWorkGroupById,
    deleteWorkGroupById,
    getWorkGroupsByEmpresaId
};
