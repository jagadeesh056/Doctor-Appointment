const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, default: "General Physician" },
    experience: { type: Number, default: 4 },
    consultationFee: { type: Number, required: true, default: 600 },
    workingHours: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    qualifications: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);