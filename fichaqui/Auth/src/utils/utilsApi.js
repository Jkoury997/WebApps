const checkUserApi = async (dni, Token) => {
    try {
      const response = await fetch(`http://190.216.66.210:10292/api/Catalogo/Personal/${dni}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Token': Token
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching personal data:', error);
      return null; // Devuelve null en caso de error
    }
  };

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

module.exports={
    loginJinx,
    userAccess,
    checkUserApi
}
  
