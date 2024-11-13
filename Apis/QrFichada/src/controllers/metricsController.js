const metricsService = require('../services/metricsService');

const getAsistenciaDiaria = async (req, res) => {
    try {
        const { fechaInicio, fechaFin, userId } = req.query;



        // Convertir la fecha a un objeto Date si es necesario
        const asistencia = await metricsService.obtenerDetalleAsistenciaPorDia(userId, fechaInicio, fechaFin);

        // Enviar la respuesta en formato JSON
        res.json({ asistencia });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener lugares frecuentes de entrada y salida de un usuario
const getLugaresFrecuentes = async (req, res) => {
    try {
        const { userId, fechaInicio, fechaFin } = req.query;
        const lugaresFrecuentes = await metricsService.obtenerLugaresFrecuentes(userId, fechaInicio, fechaFin);
        res.json(lugaresFrecuentes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener estadísticas de días trabajados, horas totales y horas promedio de un usuario
const getEstadisticasTrabajo = async (req, res) => {
    try {
        const { userId, fechaInicio, fechaFin } = req.query;

        // Llamar al servicio para obtener las estadísticas
        const estadisticas = await metricsService.obtenerEstadisticasTrabajo(userId, fechaInicio, fechaFin);
        
        // Enviar la respuesta en formato JSON
        res.json(estadisticas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMovimientosEntreZonas = async (req, res) => {
    try {
        const { userId, fechaInicio, fechaFin } = req.query;
        const movimientos = await metricsService.obtenerMovimientosEntreZonas(userId, fechaInicio, fechaFin);
        res.json(movimientos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTurnosIrregulares = async (req, res) => {
    try {
        const { userId, fechaInicio, fechaFin, horaInicio = 9, horaFin =20} = req.query;
        const turnosIrregulares = await metricsService.obtenerTurnosIrregulares(userId, fechaInicio, fechaFin, parseInt(horaInicio), parseInt(horaFin));
        res.json(turnosIrregulares);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTiemposZonas = async (req, res) => {
    try {
        const { userId, fechaInicio, fechaFin} = req.query;
        const tiemposZonas = await metricsService.obtenerTiempoEnZonas(userId, fechaInicio, fechaFin);
        res.json(tiemposZonas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAsistenciaDiaria,
    getLugaresFrecuentes,
    getEstadisticasTrabajo,
    getMovimientosEntreZonas,
    getTurnosIrregulares,
    getTiemposZonas

};
