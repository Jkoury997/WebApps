const express = require("express");
const router = express.Router();
const empresaController = require("../controllers/empresaController");
const upload = require("../middlewares/uploadMiddleware");
const { validarEmpresa } = require("../middlewares/validationMiddleware");

router.post("/", validarEmpresa, empresaController.crearEmpresa);
router.get("/", validarEmpresa, empresaController.obtenerEmpresas);
router.put("/:id", validarEmpresa, empresaController.editarEmpresa);
router.delete("/:id", validarEmpresa, empresaController.eliminarEmpresa);

module.exports = router;
