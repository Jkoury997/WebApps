const TrustDevice = require('../database/models/TrustDevice');
const userService = require('./userService');

// Registrar un dispositivo de confianza
const registerTrustedDevice = async (userId, fingerprint) => {
    // Verificar si el usuario existe
    const user = await userService.getUserById(userId);
    
    if (!user) {
        throw new Error('Usuario no encontrado.');  // Lanza un error si el usuario no existe
    }

    // Verificar si el dispositivo ya está registrado
    let trustedDevice = await TrustDevice.findOne({ userId, fingerprint });
    if (!trustedDevice) {
        // Registrar un nuevo dispositivo de confianza
        trustedDevice = new TrustDevice({
            userId,
            fingerprint,
            trusted: true,
        });
        await trustedDevice.save();
    }
    
    return trustedDevice;
};

// Verificar si un dispositivo es de confianza
const isTrustedDevice = async (userId, fingerprint) => {

        // Verificar si el usuario existe
        const user = await userService.getUserById(userId);
    
        if (!user) {
            throw new Error('Usuario no encontrado.');  // Lanza un error si el usuario no existe
        }

    const trustedDevice = await TrustDevice.findOne({ userId, fingerprint });
    return !!trustedDevice;  // Retorna true si el dispositivo es de confianza
};

// Actualizar el dispositivo de confianza con OTP
const updateTrustedDevice = async (userId, newFingerprint) => {
    // Encontrar y actualizar el dispositivo de confianza existente
    const updatedDevice = await TrustDevice.findOneAndUpdate(
        { userId },
        { fingerprint: newFingerprint, trusted: true },
        { new: true }
    );
    return updatedDevice;
};

module.exports = {
    registerTrustedDevice,
    isTrustedDevice,
    updateTrustedDevice
};
