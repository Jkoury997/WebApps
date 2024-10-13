const Empresa = require('../database/models/Empresa');


// Verificar si un userId existe
const checkEmpresaExists = async (empresaId) => {
    const empresa = await Empresa.findById(empresaId);
    return !!empresa;  // Devuelve true si el usuario existe, false si no
};


module.exports = {
    checkEmpresaExists
};
