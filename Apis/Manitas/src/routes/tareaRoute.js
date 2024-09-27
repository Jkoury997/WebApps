const express = require('express');
const tareaController = require('../controllers/tareaController');
const upload = require('../middlewares/multerConfig');

const router = express.Router();

// Rutas para manejar tareas
router.post('/', upload.single('imagenAntes'), tareaController.crearTarea);
router.patch('/:id/completar', upload.single('imagenDespues'), tareaController.completarTarea);
router.get('/:id', tareaController.obtenerTareaPorId);
router.delete('/:id', tareaController.eliminarTarea);
router.get('/tienda/:tienda', tareaController.listarTareasPorTienda);
router.get('/rubro/:rubro', tareaController.listarTareasPorRubro);
router.get('/', tareaController.listarTareas);

module.exports = router;
