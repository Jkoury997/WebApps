const userService = require('../services/userService');
const empresaService = require('../services/empresaService');

// Controlador para verificar si un userId existe
const checkUserExists = async (req, res) => {
    try {
        const { id } = req.params;  // Extraer 'id' de los parámetros de la URL
        const userExists = await userService.checkUserExists(id);

        res.status(200).json({ exists: userExists });
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar el userId' });
    }
}

// Controlador para verificar si un empresaId existe
const checkEmpresaExists = async (req, res) => {
    try {
        const { id } = req.params;  // Extraer 'id' de los parámetros de la URL
        const empresaExists = await empresaService.checkEmpresaExists(id);

        res.status(200).json({ exists: empresaExists });
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar el empresaId' });
    }
}

module.exports = {
    checkUserExists,
    checkEmpresaExists
}
