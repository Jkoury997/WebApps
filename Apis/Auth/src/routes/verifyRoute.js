const express = require('express');
const { checkUserExists,checkEmpresaExists } = require('../controllers/verifyController');

const router = express.Router();

// Ruta para verificar si un userId existe 
router.get('/:id', checkUserExists);

// Ruta para verificar si un empresaId existe 
router.get('/empresa/:id',checkEmpresaExists );

module.exports = router;
