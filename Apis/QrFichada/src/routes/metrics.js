const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');

router.get('/total-fichadas', metricsController.getTotalFichadas);
router.get('/asistencia-diaria', metricsController.getAsistenciaDiaria);
router.get('/asistencia-semanal', metricsController.getAsistenciaSemanal);
router.get('/asistencia-mensual', metricsController.getAsistenciaMensual);
router.get('/fichadas-por-zona', metricsController.getFichadasPorZona);
router.get('/horario-pico', metricsController.getHorarioPico);
router.get('/tiempo-estadia-promedio', metricsController.getTiempoEstadiaPromedio);
router.get('/super-reporte-empleado', metricsController.getSuperReporteEmpleado);
router.get('/movimientos', metricsController.obtenerReporteMovimientos);
router.get('/todos-movimientos', metricsController.getMovimientosPorUsuario);
module.exports = router;
