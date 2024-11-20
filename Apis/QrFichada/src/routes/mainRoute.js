// routes/userRoutes.js

const qrRoute = require("./qrRoute")

const zoneRoute = require("./zoneRoute")

const attendanceRoute = require("./attendanceRoute")

const metricsRoute = require("./metrics")

const userExtraRoute = require("./userExtraRoute")

const workGroupRoute = require("./workGroupRoute")

const express = require("express")



const router = express.Router();

router.use('/qr', qrRoute); //Seguridad completa
router.use('/zones', zoneRoute); //Seguridad completa
router.use('/attendance', attendanceRoute); //Seguridad completa
router.use("/metrics",metricsRoute)
router.use("/user-extra",userExtraRoute)
router.use("/work-group",workGroupRoute)


module.exports = router