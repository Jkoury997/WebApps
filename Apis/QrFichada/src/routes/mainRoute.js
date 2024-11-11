// routes/userRoutes.js

const qrRoute = require("./qrRoute")

const zoneRoute = require("./zoneRoute")

const attendanceRoute = require("./attendanceRoute")

const metricsRoute = require("./metrics")

const express = require("express")



const router = express.Router();

router.use('/qr', qrRoute); //Seguridad completa
router.use('/zones', zoneRoute); //Seguridad completa
router.use('/attendance', attendanceRoute); //Seguridad completa
router.use("/metrics",metricsRoute)


module.exports = router