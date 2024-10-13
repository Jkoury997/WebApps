const AUTH_API = process.env.AUTH_API_URL;

// Middleware para verificar si el fingerprint y el userId existen en la API de autenticación
const verifyFingerprintMiddleware = async (req, res, next) => {
    const { userId, fingerprint } = req.body;
    console.log(userId,fingerprint)

    // Verificar que ambos valores estén presentes
    if (!userId || !fingerprint) {
        return res.status(400).json({ message: 'El userId y el fingerprint son requeridos.' });
    }

    try {
        // Hacer la solicitud a la API de autenticación para verificar fingerprint y userId
        const response = await fetch(`${AUTH_API}/api/trust-device/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, fingerprint }),
        });

        // Si la respuesta no es exitosa, devolver el error correspondiente
        if (!response.ok) {
            if (response.status === 404) {
                return res.status(404).json({ message: 'El dispositivo de confianza no fue encontrado.' });
            }
            return res.status(500).json({ message: 'Error al contactar con la API de autenticación.' });
        }

        const data = await response.json();
        console.log(data)

        // Si el fingerprint no es válido, devolver un error
        if (!data.isTrusted) {
            return res.status(401).json({ message: 'Fingerprint inválido o no coincide.' });
        }

        // Si todo está bien, continuar al siguiente middleware o controlador
        next();
    } catch (error) {
        console.error('Error al verificar el fingerprint:', error.message);
        return res.status(500).json({ message: 'No se pudo verificar el fingerprint.' });
    }
};

module.exports = verifyFingerprintMiddleware;
