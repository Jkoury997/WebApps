const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Obtener un usuario por ID
router.get('/:id', userController.getUserById);

// Obtener usuarios por empresa
router.get('/empresa/:empresaId', userController.getUsersByEmpresa);

// Obtener usuario por email
router.get('/email/:email', userController.getUserByEmail);

// Modificar un usuario por ID
router.put('/:id', userController.updateUser);

// Eliminar un usuario por ID
router.delete('/:id', userController.deleteUser);



module.exports = router;
