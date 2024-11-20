const express = require('express');
const router = express.Router();
const workGroupController = require('../controllers/workGroupController');

// Crear un nuevo WorkGroup
router.post('/', workGroupController.createWorkGroup);

// Obtener todos los WorkGroups
router.get('/', workGroupController.getAllWorkGroups);

// Obtener todos los WorkGroups
router.get('/empresa/:empresaId', workGroupController.getWorkGroupsByEmpresaId);

// Obtener un WorkGroup por ID
router.get('/:id', workGroupController.getWorkGroupById);

// Actualizar un WorkGroup por ID
router.put('/:id', workGroupController.updateWorkGroupById);

// Eliminar un WorkGroup por ID
router.delete('/:id', workGroupController.deleteWorkGroupById);

module.exports = router;
