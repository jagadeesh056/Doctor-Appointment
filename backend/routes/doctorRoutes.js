const express = require("express");
const doctorController = require("../controllers/doctorController.js");
const router = express.Router();

router.get("/", doctorController.getDoctors);
router.post("/", doctorController.createDoctor);
router.get("/:id/slots", doctorController.getAvailableSlots);

module.exports = router;