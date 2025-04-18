const apiTokens = require("../utils/tokenManager");

const sendAttendanceData = async (user) => {
  console.log(user)
  // Convertir el valor de sexo a formato requerido
  const sexo = user.sex === "Male" ? "M" : "F";
  
  // Obtener el token correspondiente al idSistema de la empresa del usuario
  const token = getTokenForEmpresa(user.empresa.idSistema);
  
  // Obtener la fecha y hora en la zona horaria de Argentina
  const { fechaFormateada: fecha, horaFormateada: hora } = convertirFechaArgentina(new Date().toISOString());
  
  console.log({
    Id: user.dni,
    Sexo: sexo,
    Fecha: fecha,
    Hora: hora
  });
  
  console.log("Token: ", token);

  try {
    // Realizar la solicitud POST a la API de Morgana
    const response = await fetch(`${process.env.API_MORGANA}/api/Fichada/Fichar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Token': token
      },
      body: JSON.stringify({
        Id: user.dni,
        Sexo: sexo,
        Fecha: fecha,
        Hora: hora
      })
    });

    // Verificar si la respuesta HTTP es exitosa
    if (!response.ok) {
      throw new Error(`Error en la conexión HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Validar la respuesta de la API de Morgana
    if (data.HttpStatus === 200 && data.Estado === true) {
      return data;
    } else {
      console.error("Error en la fichada:", data.CodigoError, data.Mensaje);
      throw new Error(`Error en la fichada: ${data.Mensaje || 'Sin mensaje de error'}`);
    }
  } catch (error) {
    console.error("Error al enviar datos a Morgana:", error.message);
    throw new Error(`Error al enviar datos a Morgana: ${error.message}`);
  }
};

// Función para obtener el token de una empresa específica usando idSistema
const getTokenForEmpresa = (idSistema) => {
  const empresa = Object.values(apiTokens.tokens).find(empresa => empresa.empresaCodigo === idSistema);

  // Verificar si la empresa existe en el objeto tokens y si el código coincide
  if (empresa) {
    return empresa.token;
  } else {
    throw new Error(`No se encontró el token para la empresa con código "${idSistema}".`);
  }
};

// Función para convertir fecha ISO a formato argentino en la zona horaria de Buenos Aires
const convertirFechaArgentina = (fechaISO) => {
  const fecha = new Date(fechaISO);
  const opcionesFecha = { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' };
  const opcionesHora = { timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit', hour12: false };

  const fechaArg = fecha.toLocaleDateString('es-AR', opcionesFecha).split('/');
  const horaArg = fecha.toLocaleTimeString('es-AR', opcionesHora).split(':');

  const dia = fechaArg[0];
  const mes = fechaArg[1];
  const anio = fechaArg[2];
  const hora = parseInt(horaArg[0], 10) % 24; // Asegurarse de que la hora esté en el rango 0-23
  const minutos = horaArg[1];

  const fechaFormateada = `${dia}-${mes}-${anio}`;
  const horaFormateada = `${String(hora).padStart(2, '0')}:${minutos}`;

  return { fechaFormateada, horaFormateada };
};
module.exports = {
  sendAttendanceData
};
