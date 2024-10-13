const AUTH_API = process.env.AUTH_API_URL;

// Middleware para verificar si el userId existe en la API de autenticación
const verifyUserMiddleware = async (req, res, next) => {
    const { userId } = req.body; // O de `req.params`, dependiendo de dónde se encuentre

    try {
        const response = await fetch(`${AUTH_API}/api/verify/${userId}`);

        // Si la respuesta no es exitosa, devolver un error
        if (!response.ok) {
            if (response.status === 404) {
                return res.status(404).json({ message: 'UserId no encontrado.' });
            }
            return res.status(500).json({ message: 'Error al contactar con la API de autenticación.' });
        }

        const data = await response.json();

        if (!data.exists) {
            return res.status(404).json({ message: 'UserId no existe.' });
        }

        // Si todo está bien, continuar al siguiente middleware o controlador
        next();
    } catch (error) {
        console.error('Error al verificar el userId:', error.message);
        return res.status(500).json({ message: 'No se pudo verificar el userId.' });
    }
};

module.exports = verifyUserMiddleware;
