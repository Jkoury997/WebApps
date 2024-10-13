const Role = require('../database/models/Role');

// Obtener roles por userId
const getRolesByUserId = async (userId) => {
    const roles = await Role.findOne({ userId });
    return roles;  // Retorna todos los roles del usuario en diferentes empresas
};

// Obtener roles por empresaId
const getRolesByEmpresaId = async (empresaId) => {
    const roles = await Role.find({ empresaId });
    return roles;  // Retorna todos los roles en esa empresa
};

// Asignar o actualizar el rol de un usuario en una empresa
const assignOrUpdateRoleForUserInEmpresa = async (userId, empresaId, roleName) => {
    // Verificar si ya existe un rol para ese usuario en esa empresa
    const existingRole = await Role.findOne({ userId, empresaId });

    if (existingRole) {
        // Si ya tiene un rol, lo actualizamos
        existingRole.role = roleName;
        await existingRole.save();
        return existingRole;
    }

    // Si no tiene un rol, creamos uno nuevo
    const role = new Role({ userId, empresaId, role: roleName });
    await role.save();
    return role;
};

module.exports = {
    getRolesByUserId,
    getRolesByEmpresaId,
    assignOrUpdateRoleForUserInEmpresa
};