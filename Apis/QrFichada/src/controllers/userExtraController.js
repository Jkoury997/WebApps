const userExtraService = require('../services/userExtraService');

// Crear un UserExtra
const createUserExtra = async (req, res) => {
    
    try {
        const { userId, workGroupId } = req.body; // Extrae los datos del cuerpo de la solicitud
        
        const newUserExtra = await userExtraService.createUserExtra({ userId, workGroupId });
        res.status(201).json(newUserExtra); // Responde con el nuevo registro creado
    } catch (error) {
        res.status(500).json({ message: error.message }); // Maneja errores
    }
};

// Actualizar un UserExtra
const updateUserExtra = async (req, res) => {
    try {
        const { userId } = req.params; // Extrae el userId de los parámetros de la URL
        const { workGroupId } = req.body; // Extrae el workGroupId del cuerpo de la solicitud
        const updatedUserExtra = await userExtraService.updateUserExtra(userId, workGroupId );
        res.status(200).json(updatedUserExtra); // Responde con el registro actualizado
    } catch (error) {
        res.status(500).json({ message: error.message }); // Maneja errores
    }
};

// Obtener un UserExtra
const getUserExtra = async (req, res) => {
    try {
        const { userId } = req.params; // Extrae el userId de los parámetros de la URL
        const userExtra = await userExtraService.getUserExtra(userId);
        if (!userExtra) {
            return res.status(404).json({ message: 'No se encontró información para este usuario.' });
        }
        res.status(200).json(userExtra); // Responde con el registro encontrado
    } catch (error) {
        res.status(500).json({ message: error.message }); // Maneja errores
    }
};

// Eliminar un UserExtra
const deleteUserExtra = async (req, res) => {
    try {
        const { userId } = req.params; // Extrae el userId de los parámetros de la URL
        const deleted = await userExtraService.deleteUserExtra(userId);
        if (!deleted) {
            return res.status(404).json({ message: 'No se encontró información para este usuario.' });
        }
        res.status(200).json({ message: 'Registro eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Maneja errores
    }
};

module.exports = {
    createUserExtra,
    updateUserExtra,
    getUserExtra,
    deleteUserExtra,
};
