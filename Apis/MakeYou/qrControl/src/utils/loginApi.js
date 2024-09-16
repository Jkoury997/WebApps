const loginJinx = async () => {
    console.log(process.env.EMAIL_FICHADA)
    const response = await fetch(`${process.env.API_JINX}/api/Login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            Usuario: process.env.EMAIL_FICHADA,
            Password: process.env.PASSWORD_FICHADA
        })
    });

    if (!response.ok) {
        throw new Error('Error en la solicitud de inicio de sesión');
    }

    const data = await response.json();
    return data;
};


const userAccess = async (accessKey) => {
    const response = await fetch(`${process.env.API_JINX}/api/UserAccess`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            AccessKey: accessKey,
            Empresa: process.env.EMPRESA
        })
    });

    if (!response.ok) {
        throw new Error('Error en la solicitud de acceso de usuario');
    }

    const data = await response.json();
    return data;
};


const fichadaApi = async (dataUser, Token, currentTime) => {
    try {
        const { fechaFormateada, horaFormateada } = convertirFechaArgentina(currentTime);

        const response = await fetch(`${process.env.API_MORGANA}/api/Fichada/Fichar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Token': Token
            },
            body: JSON.stringify({
                Id: dataUser.id,
                Sexo: dataUser.sex,
                Fecha: fechaFormateada,
                Hora: horaFormateada
            })
        });

        if (!response.ok) {
            console.error('Error en la respuesta de fichada:', await response.text());
            throw new Error('Error en la solicitud de fichada');
        }

        const data = await response.json();
        console.log('Correcto', data);

        return data;
    } catch (error) {
        console.error('Error en la función fichadaApi:', error);
        throw error;
    }
};


const convertirFechaArgentina = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const opcionesFecha = { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' };
    const opcionesHora = { timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit', hour12: false };

    const fechaArg = fecha.toLocaleDateString('es-AR', opcionesFecha).split('/');
    const horaArg = fecha.toLocaleTimeString('es-AR', opcionesHora).split(':');

    const dia = fechaArg[0];
    const mes = fechaArg[1];
    const anio = fechaArg[2];
    const hora = horaArg[0];
    const minutos = horaArg[1];

    const fechaFormateada = `${dia}/${mes}/${anio}`;
    const horaFormateada = `${hora}:${minutos}`;

    return { fechaFormateada, horaFormateada };
};

module.exports = {
    loginJinx,
    userAccess,
    fichadaApi
}