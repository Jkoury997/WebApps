const OTP = require('../database/models/OTP');
const User = require('../database/models/User');
const nodemailer = require('nodemailer');

// Servicio para generar el OTP y enviarlo por correo electrónico
const generateOTP = async (email, empresaId) => {
    // Verificar si el usuario existe con el email y empresaId
    const user = await User.findOne({ email, empresa: empresaId });
    if (!user) {
        throw new Error('Usuario no encontrado para la empresa proporcionada.');
    }

    // Eliminar cualquier OTP existente para el usuario
    await OTP.deleteMany({ userId: user._id });

    // Generar OTP de 6 dígitos
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Establecer la fecha de expiración (10 minutos)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Crear el nuevo OTP
    await OTP.create({
        otpCode,
        userId: user._id,
        expiresAt
    });

    // Enviar OTP por correo
    await sendOTPByEmail(user.email, otpCode);

    return { message: 'OTP enviado al correo electrónico.' };
};


// Servicio para verificar OTP sin cambiar la contraseña
const verifyOTP = async (email, empresaId, otpCode) => {
    // Buscar al usuario por email y empresaId
    const user = await User.findOne({ email, empresa: empresaId });
    if (!user) {
        throw new Error('Usuario no encontrado para la empresa proporcionada.');
    }

    // Buscar el OTP correspondiente en la base de datos
    const otp = await OTP.findOne({ otpCode, userId: user._id, isUsed: false });
    if (!otp) {
        throw new Error('OTP inválido o ya utilizado.');
    }

    // Verificar si el OTP ha expirado
    if (otp.expiresAt < new Date()) {
        throw new Error('OTP expirado.');
    }

    // Marcar el OTP como utilizado
    otp.isUsed = true;
    await otp.save();

    return { message: 'OTP verificado correctamente.',isValidOTP: true};
};

// Servicio para verificar OTP y cambiar la contraseña
const changePasswordWithOTP = async (email, empresaId, otpCode, newPassword) => {
    // Verificar si el OTP es válido
    await verifyOTP(email, empresaId, otpCode);

    // Buscar al usuario para cambiar la contraseña
    const user = await User.findOne({ email, empresa: empresaId });
    if (!user) {
        throw new Error('Usuario no encontrado para la empresa proporcionada.');
    }

    // Cambiar la contraseña del usuario
    user.password = newPassword;  // El pre-hook del esquema se encargará de hashearla
    await user.save();  // Guardar la nueva contraseña (bcrypt se encargará del hashing automáticamente)

    return { message: 'Contraseña cambiada correctamente.' };
};

// Función para enviar el OTP por correo
const sendOTPByEmail = async (email, otpCode) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,  // Usar SSL
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMTP_USERNAME,
        to: email,
        subject: 'Recuperación de contraseña - OTP',
        text: `Tu OTP es: ${otpCode}. Este código es válido por 10 minutos.`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    generateOTP,
    verifyOTP,
    changePasswordWithOTP
};
