const express = require("express");
const router = express.Router();
const zonaController = require("../controllers/zonaController");
const { validarZona } = require("../middlewares/validationMiddleware");

router.post("/", validarZona, zonaController.crearZona);
router.get("/", zonaController.obtenerZonas);
router.get("/empresa/:id", zonaController.obtenerZonasEmpresa);
router.put("/:id", validarZona, zonaController.editarZona);
router.delete("/:id", validarZona, zonaController.eliminarZona);

module.exports = router;
