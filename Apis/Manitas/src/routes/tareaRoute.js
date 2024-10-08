const express = require('express');
const tareaController = require('../controllers/tareaController');
const upload = require('../middlewares/multerConfig');

const router = express.Router();

// Crear tarea con imagen "antes"
router.post('/', upload.single('imagenAntes'), tareaController.crearTarea);

// Completar tarea con imagen "después"
router.post('/completar/:id', upload.single('imagenDespues'), tareaController.completarTarea);


// Obtener tarea por ID
router.get('/:id', tareaController.obtenerTareaPorId);

// Eliminar tarea
router.delete('/:id', tareaController.eliminarTarea);

// Listar tareas por tienda
router.get('/lugar/:lugar', tareaController.listarTareasPorLugar);

// Listar tareas por rubro
router.get('/rubro/:rubro', tareaController.listarTareasPorRubro);

// **Listar tareas por empresa**
router.get('/empresa/:empresa', tareaController.listarTareasPorEmpresa);

// Listar todas las tareas
router.get('/', tareaController.listarTareas);

module.exports = router;
