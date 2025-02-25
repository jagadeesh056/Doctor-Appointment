const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const { errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const Doctor = require("./models/Doctor");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);

const mongoUrl = process.env.MONGO_URL || "mongodb+srv://DoctorAssignment:chnlA2tjuVb4ucqd@cluster0.w5ewg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedDefaultDoctors()
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });


const seedDefaultDoctors = async () => {
  try {
    const count = await Doctor.countDocuments();
    console.log("Current doctor count:", count);
    if (count === 0) {
      const defaultDoctors = [
        {
          name: "Dr. Jane Doe",
          specialization: "General Physician",
          consultationFee: 600,
          workingHours: { start: "09:00", end: "17:00" },
          qualifications: "MBBS",
        },
        {
          name: "Dr. John Smith",
          specialization: "Obstetrician",
          consultationFee: 800,
          workingHours: { start: "10:00", end: "18:00" },
          qualifications: "MBBS, MD",
        },
        {
          name: "Dr. Emily Johnson",
          specialization: "Pediatrician",
          consultationFee: 700,
          workingHours: { start: "08:00", end: "16:00" },
          qualifications: "MBBS, DCH",
        },
      ];

      await Doctor.insertMany(defaultDoctors);
      console.log("Default doctors seeded.");
    } else {
      console.log("Doctors already exist in the database. No seeding required.");
    }
  } catch (error) {
    console.error("Error seeding default doctors:", error);
  }
};

app.use((req, res, next) => {
  next(new ApiError(404, "Not found"));
});

app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
