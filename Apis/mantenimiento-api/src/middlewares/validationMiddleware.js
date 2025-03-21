const { body, param, validationResult } = require("express-validator");

// Middleware para manejar los errores de validación
const validar = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    next();
};

// Validaciones para Empresas
const validarEmpresa = [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    validar,
];

// Validaciones para Zonas
const validarZona = [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("empresa").isUUID().withMessage("El ID de la empresa debe ser un UUID válido"),
    validar,
];

// Validaciones para Tareas
const validarTarea = [
    body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
    body("categoria").notEmpty().withMessage("La categoría es obligatoria"),
    body("zona").isUUID().withMessage("El ID de la zona debe ser un UUID válido"),
    body("nombre").notEmpty().withMessage("El nombre es obligatoria"),
    body("ubicacionExpecifica").notEmpty().withMessage("La ubicacionExpecifica es obligatoria"),
    validar,
];

// Validación para actualización de estado de Tareas
const validarEstadoTarea = [
    body("estado")
        .isIn(["Creada", "Pendiente", "Realizada", "Supervisión", "Finalizada"])
        .withMessage("Estado no válido"),
    validar,
];

module.exports = {
    validarEmpresa,
    validarZona,
    validarTarea,
    validarEstadoTarea,
};
