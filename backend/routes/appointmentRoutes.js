const express = require("express");
const appointmentController = require("../controllers/appointmentController.js");
const router = express.Router();

router.get("/", appointmentController.getAppointments);
router.get("/:id", appointmentController.getAppointmentById);

router.post("/", appointmentController.createAppointment);
router.delete("/:id", appointmentController.deleteAppointment)
router.put("/:id", appointmentController.editAppointment)
module.exports = router;