const jwt = require('jsonwebtoken');

// Claves secretas para los tokens
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

// Tiempo de vida del Access Token y Refresh Token
const ACCESS_TOKEN_EXPIRATION = '15m'; // 15 minutos
const REFRESH_TOKEN_EXPIRATION = '7d'; // 7 días

// Generar Access Token (vencimiento corto)
const generateAccessToken = (userId,empresa, role) => {
    return jwt.sign({ userId: userId, empresa: empresa,role:role }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
}

// Generar Refresh Token (vencimiento largo)
const generateRefreshToken = (user, role) => {
    return jwt.sign({ userId: user._id, empresa: user.empresa,role:role }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
}

// Verificar Access Token
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new Error(error.message || 'Access Token inválido o expirado');
    }
}

// Verificar Refresh Token
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new Error(error.message || 'Refresh Token inválido o expirado');
    }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};
