const AUTH_API = process.env.AUTH_API_URL
// Función para verificar si el userId existe en la API de autenticación
const verifyUserId = async (userId) => {
    try {
        const response = await fetch(`${AUTH_API}/api/verify/${userId}`);

        // Si la respuesta no es exitosa, lanzamos un error
        if (!response.ok) {
            if (response.status === 404) {
                return false; // No encontrado
            }
            throw new Error('Error al contactar con la API de autenticación');
        }

        const data = await response.json();
        console.log(data.exists)
        return data.exists;  // Asumiendo que la API de autenticación devuelve un campo 'exists'
    } catch (error) {
        console.error('Error al verificar el userId:', error.message);
        throw new Error('No se pudo verificar el userId.');
    }
};




const userDetails = async (userId) => {
    try {
        const response = await fetch(`${AUTH_API}/api/user/${userId}`);

        // Si la respuesta no es exitosa, lanzamos un error
        if (!response.ok) {
            if (response.status === 404) {
                return false; // No encontrado
            }
            throw new Error('Error al contactar con la API de autenticación');
        }

        const data = await response.json();

        return data  // Asumiendo que la API de autenticación devuelve un campo 'exists'
    } catch (error) {
        console.error('Error al verificar el userId:', error.message);
        throw new Error('No se pudo verificar el userId.');
    }
}

const userByEmpresa = async (empresaId) => {
    try {
        const response = await fetch(`${AUTH_API}/api/user/empresa/${empresaId}`);

        // Si la respuesta no es exitosa, lanzamos un error
        if (!response.ok) {
            if (response.status === 404) {
                return false; // No encontrado
            }
            throw new Error('Error al contactar con la API de autenticación');
        }

        const data = await response.json();

        return data  // Asumiendo que la API de autenticación devuelve un campo 'exists'
    } catch (error) {
        console.error('Error al obtener users:', error.message);
        throw new Error('No se pudo verificar el userId.');
    }
}

module.exports = {
    verifyUserId,
    userDetails,
    userByEmpresa
};