const User = require('../database/models/User');

// Obtener todos los usuarios sin la contraseña
const getAllUsers = async () => {
    return await User.find().select('-password');  // Excluir el campo password
};

// Obtener un usuario por ID sin la contraseña
const getUserById = async (userId) => {
    return await User.findById(userId).select('-password');  // Excluir el campo password
};

// Obtener usuarios por empresa sin la contraseña
const getUsersByEmpresa = async (empresaId) => {
    return await User.find({ empresa: empresaId }).select('-password');  // Excluir el campo password
};

// Obtener usuario por email sin la contraseña
const getUserByEmail = async (email) => {
    return await User.find({ email }).select('-password');  // Excluir el campo password
};

// Modificar un usuario por ID (no hay necesidad de excluir la contraseña aquí, porque solo estás actualizando)
const updateUser = async (userId, userData) => {
    // Evitar que se modifique la contraseña
    if (userData.password) {
        delete userData.password;  // Eliminar el campo password si está presente en los datos
    }

    // Actualizar el usuario sin cambiar la contraseña
    return await User.findByIdAndUpdate(userId, userData, { new: true }).select('-password');  // Excluir el campo password en la respuesta
};

// Eliminar un usuario por ID
const deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};


// Verificar si un userId existe
const checkUserExists = async (userId) => {
    const user = await User.findById(userId);
    console.log(user)
    return !!user;  // Devuelve true si el usuario existe, false si no
};


module.exports = {
    getAllUsers,
    getUserById,
    getUsersByEmpresa,
    getUserByEmail,
    updateUser,
    deleteUser,
    checkUserExists,
};
