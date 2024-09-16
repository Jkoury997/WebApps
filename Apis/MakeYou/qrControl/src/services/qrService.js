const QRCodeModel = require('../database/models/QRCode');
const { v4: uuidv4 } = require('uuid');

async function generateQRCode(useruuid, deviceUUID, dni, sex) {
  try {
    const code = uuidv4(); // Genera un código único

    // Guarda el código QR en la base de datos
    const qrCode = new QRCodeModel({
      useruuid,
      deviceUUID,
      code,
      dni,
      sex: sex ? sex[0] : null // Asegúrate de que sex no sea undefined o null
    });
    await qrCode.save();

    return code;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Error generating QR code');
  }
}

module.exports = {
  generateQRCode
};
