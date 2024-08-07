const utilsApi = require("../utils/loginApi")

const Attendance = require('../database/models/Attendace');
const QRCode = require('../database/models/QRCode');
const { sendNotification } = require('../utils/socketHandler'); // Asegúrate de que esta ruta sea correcta

const TIME_INTERVAL = 1 * 60 * 1000; // 1 minuto

const registerAttendance = async (code, location, io) => { // Agregamos io como parámetro
  try {
    const currentTime = new Date();

    // Verificar si el código QR es válido y obtener el useruuid
    const qrCode = await QRCode.findOne({ code });
    if (!qrCode) {
      console.error(`Invalid QR code: ${code}`);
      throw new Error('Invalid QR code');
    }

    //login
    const responseLogin = await utilsApi.loginJinx()
    const responseUserAccess = await utilsApi.userAccess(responseLogin.AccessKey)
    const Token = responseUserAccess.Token

    const { useruuid, deviceUUID,dni,sex } = qrCode;
    console.log(`QR code valid: useruuid=${useruuid}, deviceUUID=${deviceUUID}, dni=${dni}`);

    // Creación de un objeto dataUser con id y sex
    const dataUser = {
      id: dni.toString(),
      sex
    };

    // Verificar si el usuario ya tiene una sesión abierta
    const existingAttendance = await Attendance.findOne({ useruuid, deviceUUID, exitTime: null });

    if (existingAttendance) {
      const lastEntryTime = new Date(existingAttendance.entryTime);
      console.log(`Existing attendance found: useruuid=${useruuid}, entryTime=${lastEntryTime}`);

      // Verificar el intervalo de tiempo mínimo entre las lecturas
      if (currentTime - lastEntryTime < TIME_INTERVAL) {
        console.error(`Cannot register another entry/exit within 1 minute for useruuid=${useruuid}`);
        throw new Error('Cannot register another entry/exit within 1 minute');
      }

      // Registrar la salida

      existingAttendance.exitTime = currentTime;
      await existingAttendance.save();

      await utilsApi.fichadaApi(dataUser,Token,currentTime)


      console.log(`Exit registered successfully for useruuid=${useruuid} at ${currentTime}`);
      
      // Enviar notificación de salida
      const message = `Salida registrada: ${currentTime}`;
      sendNotification(useruuid, message, io);

      return { message: 'Exit registered successfully', useruuid, entryTime: existingAttendance.entryTime, exitTime: currentTime };
    } else {
      // Registrar la entrada
      const attendance = new Attendance({
        useruuid,
        deviceUUID,
        entryTime: currentTime,
        location,
      });


      await attendance.save();

      await utilsApi.fichadaApi(dataUser,Token,currentTime)
      console.log(`Entry registered successfully for useruuid=${useruuid} at ${currentTime}`);
      
      // Enviar notificación de entrada
      const message = `Entrada registrada: ${currentTime}`;
      sendNotification(useruuid, message, io);

      return { message: 'Entry registered successfully', useruuid, entryTime: currentTime };
    }
  } catch (error) {
    console.error('Error registering attendance:', error);
    throw error;
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
