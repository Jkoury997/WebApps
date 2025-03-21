const express = require("express");
const router = express.Router();

const empresaRoutes = require("./empresaRoute");
const zonaRoutes = require("./zonaRoute");
const tareaRoutes = require("./tareaRoute");

router.use("/empresas", empresaRoutes);
router.use("/zonas", zonaRoutes);
router.use("/tareas", tareaRoutes);

module.exports = router;