const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');

router.get('/asistencia-diaria', metricsController.getAsistenciaDiaria);
router.get('/lugares-frecuentes', metricsController.getLugaresFrecuentes);
router.get('/estadisticas-trabajo', metricsController.getEstadisticasTrabajo);
router.get('/moviemientos-zonas', metricsController.getMovimientosEntreZonas);
router.get('/turnos-irregulares', metricsController.getTurnosIrregulares);
router.get('/tiempos-zonas', metricsController.getTiemposZonas);
module.exports = router;
