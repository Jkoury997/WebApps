const utilsApi = require("../utils/loginApi")

const Attendance = require('../database/models/Attendace');
const QRCode = require('../database/models/QRCode');
const { sendNotification } = require('../utils/socketHandler'); // Asegúrate de que esta ruta sea correcta

const TIME_INTERVAL = 1 * 60 * 1000; // 1 minuto

const registerAttendance = async (code, location, io) => {
  try {
    const currentTime = new Date();
    const qrCode = await QRCode.findOne({ code });

    if (!qrCode) {
      console.error(`Invalid QR code: ${code}`);
      throw new Error('Código QR inválido');
    }

    const responseLogin = await utilsApi.loginJinx();
    const responseUserAccess = await utilsApi.userAccess(responseLogin.AccessKey);
    const Token = responseUserAccess.Token;

    const { useruuid, deviceUUID, dni, sex } = qrCode;

    const dataUser = {
      id: dni.toString(),
      sex,
    };

    const existingAttendance = await Attendance.findOne({ useruuid, deviceUUID, exitTime: null });

    if (existingAttendance) {
      const lastEntryTime = new Date(existingAttendance.entryTime);

      if (currentTime - lastEntryTime < TIME_INTERVAL) {
        console.error(`Cannot register another entry/exit within 1 minute for useruuid=${useruuid}`);
        throw new Error('No se puede registrar otra entrada/salida dentro de 1 minuto');
      }

      existingAttendance.exitTime = currentTime;
      await existingAttendance.save();

      await utilsApi.fichadaApi(dataUser, Token, currentTime);

      const message = `Salida registrada correctamente`;
      sendNotification(useruuid, { message }, io);

      return { message: 'Salida registrada correctamente', useruuid, entryTime: existingAttendance.entryTime, exitTime: currentTime };
    } else {
      const attendance = new Attendance({
        useruuid,
        deviceUUID,
        entryTime: currentTime,
        location,
      });

      await attendance.save();

      await utilsApi.fichadaApi(dataUser, Token, currentTime);

      const message = `Entrada registrada correctamente`;
      sendNotification(useruuid, { message }, io);

      return { message: 'Entrada registrada correctamente', useruuid, entryTime: currentTime };
    }
  } catch (error) {
    console.error('Error registrando la asistencia:', error.message);
    throw new Error(error.message); // Asegúrate de lanzar el error con un mensaje claro
  }
};


// Cerrar sesiones abiertas automáticamente después de 14 horas
const closeAutomaticSessions = async () => {
  const threshold = new Date(Date.now() - 14 * 60 * 60 * 1000);

  // Buscar todas las sesiones abiertas que superen las 14 horas
  const sessionsToClose = await Attendance.find({ entryTime: { $lt: threshold }, exitTime: null });

  for (const session of sessionsToClose) {
    session.exitTime = new Date(session.entryTime.getTime() + 14 * 60 * 60 * 1000);
    session.closedAutomatically = true;
    await session.save();
  }

  return sessionsToClose;
};

const updateAttendance = async (id, entryTime, exitTime, modifiedBy) => {
  const updateFields = { modifiedBy };

  if (entryTime) {
    updateFields.modifiedEntryTime = entryTime;
  }
  if (exitTime) {
    updateFields.modifiedExitTime = exitTime;
  }

  return Attendance.findByIdAndUpdate(
    id,
    updateFields,
    { new: true, runValidators: true }
  );
};


module.exports = {
  registerAttendance,
  closeAutomaticSessions,
  updateAttendance
};
