const WorkGroup = require('../database/models/WorkGroup');

// Crear un nuevo WorkGroup
const createWorkGroup = async (workGroupData) => {
    const workGroup = new WorkGroup(workGroupData);
    return await workGroup.save();
};

// Obtener todos los WorkGroups
const getAllWorkGroups = async () => {
    return await WorkGroup.find();
};

// Obtener un WorkGroup por ID
const getWorkGroupById = async (id) => {
    return await WorkGroup.findById(id);
};


// Obtener WorkGroups por empresaId
const getWorkGroupsByEmpresaId = async (empresaId) => {
    try {
      const workGroups = await WorkGroup.find({ empresaId });
      return workGroups;
    } catch (error) {
      console.error("Error al obtener WorkGroups por empresaId:", error);
      throw error; // Lanza el error para que pueda ser manejado en un nivel superior
    }
  };

// Actualizar un WorkGroup por ID
const updateWorkGroupById = async (id, updatedData) => {
    return await WorkGroup.findByIdAndUpdate(id, updatedData, { new: true });
};

// Eliminar un WorkGroup por ID
const deleteWorkGroupById = async (id) => {
    return await WorkGroup.findByIdAndDelete(id);
};

module.exports = {
    createWorkGroup,
    getAllWorkGroups,
    getWorkGroupById,
    updateWorkGroupById,
    deleteWorkGroupById,
    getWorkGroupsByEmpresaId
};
