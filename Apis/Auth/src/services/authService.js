const User = require('../database/models/User');
const Empresa = require('../database/models/Empresa');
const RefreshToken = require('../database/models/RefreshToken');
const roleService = require('../services/roleService');
const jwtService = require('../services/jwtService'); 
const bcrypt = require('bcryptjs');

// Registrar un nuevo usuario
const registerUser = async (userData) => {
    const { email, dni, empresa } = userData;

    // Verificar si la empresa existe en la base de datos
    const existingEmpresa = await Empresa.findById(empresa);
    if (!existingEmpresa) {
        throw new Error('La empresa no existe.');
    }
    
    // Verificar si el email o dni ya existen en la misma empresa
    const existingUser = await User.findOne({
        empresa, 
        $or: [{ email }, { dni }]
    });

    if (existingUser) {
        throw new Error('El usuario ya existe con ese email o dni en esta empresa.');
    }

    // Crear el nuevo usuario
    const newUser = new User(userData);
    await newUser.save();

    // Asignar el rol de "usuario" por defecto al registrarse
    await roleService.assignOrUpdateRoleForUserInEmpresa(newUser._id, empresa, 'usuario');
    
    return newUser;
}

// Servicio de login
const loginUser = async (email, password, empresa) => {
    const user = await User.findOne({ email, empresa });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Credenciales inválidas.');
    }

     // Obtener el rol del usuario en esta empresa
     const userRole = await roleService.getRolesByUserId(user._id);
     if (!userRole) {
         throw new Error('El usuario no tiene un rol asignado.');
     }

    // Generar Refresh Token y guardarlo en la base de datos
    const refreshToken = await createAndSaveRefreshToken(user,userRole.role);

    const accessToken = await refreshAccessToken(refreshToken)


    return { accessToken, refreshToken, user };
};

// Crear y guardar el Refresh Token en la base de datos
const createAndSaveRefreshToken = async (user,role) => {
    const refreshToken = jwtService.generateRefreshToken(user,role);

    // Guardar el Refresh Token en la base de datos
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Token expira en 7 días

    // Asegurarse de que el userId sea un ObjectId
    await RefreshToken.create({
        token: refreshToken,
        userId: user._id,  // Esto debe ser ObjectId y no un string
        expiresAt
    });

    return refreshToken;
};

// Servicio para refrescar el Access Token
const refreshAccessToken = async (refreshToken) => {
    // Verificar si el Refresh Token existe en la base de datos
    const storedToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedToken) {
        throw new Error('El token de actualización es inválido o ha sido revocado.');
    }

    // Verificar el Refresh Token usando JWT
    const decoded = jwtService.verifyRefreshToken(refreshToken);

    // Extraer la información necesaria del token decodificado
    const { userId,empresa,role } = decoded;


    // Generar un nuevo Access Token
    const newAccessToken = jwtService.generateAccessToken(userId,empresa, role);

    return newAccessToken;
};

// Servicio para el logout del usuario
const logoutUser = async (refreshToken) => {
    try {
        // Verificar si el Refresh Token existe antes de intentar eliminarlo
        const token = await RefreshToken.findOne({ token: refreshToken });
        
        if (!token) {
            console.log('Token no encontrado:', refreshToken);  // Depuración: Verificar si el token no se encuentra
            throw new Error('El token de actualización no es válido o ya ha sido eliminado.');
        }

        // Eliminar el token si se encuentra
        await RefreshToken.findOneAndDelete({ token: refreshToken });
        console.log('Token eliminado:', refreshToken);  // Depuración: Confirmar que el token ha sido eliminado

        return true; // Token eliminado correctamente
    } catch (error) {
        console.log('Error al eliminar el token:', error);  // Depuración: Mostrar el error
        throw new Error(`Error al realizar el logout: ${error.message}`);
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    createAndSaveRefreshToken,
    refreshAccessToken
};
