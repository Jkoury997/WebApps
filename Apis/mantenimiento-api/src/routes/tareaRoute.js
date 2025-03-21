const express = require("express");
const router = express.Router();
const tareaController = require("../controllers/tareaController");
const upload = require("../middlewares/uploadMiddleware");
const { validarTarea, validarEstadoTarea } = require("../middlewares/validationMiddleware");

router.post("/", validarTarea, tareaController.crearTarea);
router.get("/", tareaController.obtenerTareas);
router.get("/empresa/:id", tareaController.obtenerTareasEmpresa);
router.put("/:id", validarTarea, tareaController.editarTarea);
router.patch("/:id", validarEstadoTarea, tareaController.actualizarEstadoTarea);
router.delete("/:id", tareaController.eliminarTarea);
router.get("/reportes/tiempos", tareaController.reporteTiempos);

// 📌 Ruta para subir evidencia de tareas con imágenes (Máximo 5 imágenes)
router.post("/:id/evidencia", upload.array("imagenes", 5), tareaController.subirEvidencia);

module.exports = router;
