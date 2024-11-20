const UserExtra = require('../database/models/UserExtra');

// Crear un UserExtra
const createUserExtra = async ({ userId, workGroupId }) => {
    try {
        const userExtra = new UserExtra({ userId, workGroupId });
        return await userExtra.save();
    } catch (error) {
        throw new Error(`Error al crear UserExtra: ${error.message}`);
    }
};

// Actualizar un UserExtra
const updateUserExtra = async (userId, workGroupId ) => {
    try {
        const userExtra = await UserExtra.findOneAndUpdate(
            { userId }, // Busca por userId
            { $set: { workGroupId } }, // Actualiza solo el campo workGroupId
            { new: true, runValidators: true } // Devuelve el documento actualizado y aplica validaciones
          );
        if (!userExtra) {
            throw new Error('No se encontró información para este usuario.');
        }
        return userExtra;
    } catch (error) {
        throw new Error(`Error al actualizar UserExtra: ${error.message}`);
    }
};

// Obtener un UserExtra
const getUserExtra = async (userId) => {
    try {
      const userExtra = await UserExtra.findOne({ userId }).populate('workGroupId');
      if (!userExtra) {
        throw new Error('UserExtra no encontrado');
      }
      return userExtra;
    } catch (error) {
      throw new Error(`Error al obtener UserExtra: ${error.message}`);
    }
  };

// Eliminar un UserExtra
const deleteUserExtra = async (userId) => {
    try {
        const deleted = await UserExtra.findOneAndDelete({ userId });
        return deleted;
    } catch (error) {
        throw new Error(`Error al eliminar UserExtra: ${error.message}`);
    }
};

module.exports = {
    createUserExtra,
    updateUserExtra,
    getUserExtra,
    deleteUserExtra,
};
