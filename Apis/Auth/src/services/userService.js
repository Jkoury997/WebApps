const User = require('../database/models/User');

// Obtener todos los usuarios sin la contraseña
const getAllUsers = async () => {
    // Devuelve todos los usuarios, excluyendo el campo "password"
    return await User.find().select('-password');
};

// Obtener un usuario por ID sin la contraseña
const getUserById = async (userId) => {
    // Busca un usuario por su ID, excluye el campo "password" y usa "populate" para traer los datos de la empresa relacionada
    return await User.findById(userId)
        .select('-password')         // Excluir el campo password
        .populate('empresa');        // Traer los datos de la empresa relacionada
};

// Obtener usuarios por empresa sin la contraseña
const getUsersByEmpresa = async (empresaId) => {
    // Devuelve una lista de usuarios pertenecientes a una empresa específica, excluyendo el campo "password"
    return await User.find({ empresa: empresaId }).select('-password');
};

// Obtener usuario por email sin la contraseña
const getUserByEmail = async (email) => {
    // Busca un usuario por su email, excluyendo el campo "password"
    return await User.find({ email }).select('-password');
};

// Obtener usuario por email y empresa sin la contraseña
const getUserByEmailAndEmpresa = async (email, empresaId) => {
    // Busca un usuario por email y empresa, excluyendo el campo "password"
    return await User.findOne({ email, empresa: empresaId }).select('-password');
};

// Modificar un usuario por ID (excluyendo campos sensibles)
const updateUser = async (userId, userData) => {
    // Define los campos que deben ser excluidos para evitar su modificación
    const fieldsToExclude = ['password', '_id', 'empresa', 'failedLoginAttempts', 'lockUntil'];
    fieldsToExclude.forEach(field => delete userData[field]);

    // Actualiza el usuario con los datos proporcionados, excluyendo el campo "password" en la respuesta
    return await User.findByIdAndUpdate(userId, userData, { new: true }).select('-password');
};

// Eliminar un usuario por ID
const deleteUser = async (userId) => {
    // Elimina un usuario por su ID
    return await User.findByIdAndDelete(userId);
};

// Verificar si un userId existe
const checkUserExists = async (userId) => {
    // Busca un usuario por su ID y devuelve true si existe o false si no
    const user = await User.findById(userId);
    return !!user;
};

// Exporta todas las funciones para ser utilizadas en otros módulos
module.exports = {
    getAllUsers,
    getUserById,
    getUsersByEmpresa,
    getUserByEmail,
    updateUser,
    deleteUser,
    checkUserExists,
    getUserByEmailAndEmpresa
};
