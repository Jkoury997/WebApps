const metricsService = require('../services/metricsService');

const getTotalFichadas = async (req, res) => {
    try {
        const { empresaId } = req.query;
        const total = await metricsService.obtenerTotalFichadas(empresaId);
        res.json({ total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAsistenciaDiaria = async (req, res) => {
    try {
        const { fecha, empresaId } = req.query;
        const asistencia = await metricsService.obtenerAsistenciaDiaria(empresaId, new Date(fecha));
        res.json({ asistencia });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAsistenciaSemanal = async (req, res) => {
    try {
        const { fechaInicio, fechaFin, empresaId } = req.query;
        const asistencia = await metricsService.obtenerAsistenciaSemanal(empresaId, new Date(fechaInicio), new Date(fechaFin));
        res.json({ asistencia });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAsistenciaMensual = async (req, res) => {
    try {
        const { mes, anio, empresaId } = req.query;
        const asistencia = await metricsService.obtenerAsistenciaMensual(empresaId, parseInt(mes), parseInt(anio));
        res.json({ asistencia });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getFichadasPorZona = async (req, res) => {
    try {
        const { empresaId } = req.query;
        const zonas = await metricsService.obtenerFichadasPorZona(empresaId);
        res.json({ zonas });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHorarioPico = async (req, res) => {
    try {
        const horario = await metricsService.obtenerHorarioPico();
        res.json({ horario });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTiempoEstadiaPromedio = async (req, res) => {
    try {
        const { userId } = req.query;
        const tiempoPromedio = await metricsService.obtenerTiempoEstadiaPromedio(userId);
        res.json({ tiempoPromedio });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para el súper reporte del empleado
const getSuperReporteEmpleado = async (req, res) => {
    try {
        const { userId } = req.query;
        const reporte = await metricsService.generarSuperReporteEmpleado(userId);
        res.json(reporte);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerReporteMovimientos = async (req, res) => {
    try {
        const { userId, fecha } = req.query;
        const reporte = await metricsService.obtenerMovimientosPorFecha(userId, new Date(fecha));
        res.json(reporte);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getMovimientosPorUsuario = async (req, res) => {
    try {
        const { userId } = req.query;
        const reporte = await metricsService.obtenerTodosLosMovimientos(userId);
        res.json(reporte);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    getTotalFichadas,
    getAsistenciaDiaria,
    getAsistenciaSemanal,
    getAsistenciaMensual,
    getFichadasPorZona,
    getHorarioPico,
    getTiempoEstadiaPromedio,
    getSuperReporteEmpleado,
    obtenerReporteMovimientos,
    getMovimientosPorUsuario
};
