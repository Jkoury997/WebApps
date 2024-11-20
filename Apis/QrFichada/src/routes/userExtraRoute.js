const express = require('express');
const router = express.Router();
const userExtraController = require('../controllers/userExtraController');

// Crear un UserExtra
router.post('/', userExtraController.createUserExtra);

// Actualizar un UserExtra
router.put('/:userId', userExtraController.updateUserExtra);

// Obtener un UserExtra por userId
router.get('/:userId', userExtraController.getUserExtra);

// Eliminar un UserExtra por userId
router.delete('/:userId', userExtraController.deleteUserExtra);

module.exports = router;
