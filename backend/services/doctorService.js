const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const ApiError = require("../utils/ApiError");
const moment = require("moment-timezone");
async function getDoctors() {
  try {
    const doctors = await Doctor.find({});
    return doctors;
  } catch (error) {
    throw new ApiError(404, error.message);
  }
}

async function createDoctor(doctorBody) {
  try {
    let newDoctor = new Doctor(doctorBody);
    await newDoctor.save();
    return newDoctor;
  } catch (error) {
    throw new ApiError(404, error.message);
  }
}

const getDoctorsWorkingTime = async (doctorId) => {
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new ApiError(404, "Doctor not found");
    }
    return doctor.workingHours;
  } catch (error) {
    throw new ApiError(404, error.message);
  }
};

const createAllSlots = (date, workingHoursStartTime, workingHoursEndTime) => {
  try {
    let allSlots = [];
    let slotTime = moment.tz(
      `${date} ${workingHoursStartTime}`,
      "YYYY-MM-DD HH:mm",
      "Asia/Kolkata"
    );

    const endTime = moment.tz(
      `${date} ${workingHoursEndTime}`,
      "YYYY-MM-DD HH:mm",
      "Asia/Kolkata"
    );

    while (slotTime.isBefore(endTime)) {
      allSlots.push(slotTime.format("HH:mm"));
      slotTime.add(30, "minutes");
    }
    return allSlots;
  } catch (error) {
    throw new ApiError(404, error.message);
  }
};

const fetchBookedAppointmentsForDoctorForGivenDate = async (doctorId, date) => {
  try {
    const startTimeOfDayForGivenDate = moment
      .tz(`${date} 00:00`, "YYYY-MM-DD HH:mm", "Asia/Kolkata")
      .toDate();
    const endTimeOfDayForGivenDate = moment
      .tz(`${date} 23:59`, "YYYY-MM-DD HH:mm", "Asia/Kolkata")
      .toDate();

    const bookedAppointmentsForDoctor = await Appointment.find({
      doctorId: doctorId,
      date: {
        $gte: startTimeOfDayForGivenDate,
        $lte: endTimeOfDayForGivenDate,
      },
    });

    return bookedAppointmentsForDoctor;
  } catch (error) {
    throw new ApiError(404, error.message);
  }
};

const removeOverlappingSlots = (date, bookedAppointments, allSlots) => {
  try {
    bookedAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));

    return allSlots.map((slot) => {
      const slotStartTime = moment.tz(
        `${date} ${slot}`,
        "YYYY-MM-DD HH:mm",
        "Asia/Kolkata"
      );
      const slotEndTime = slotStartTime.clone().add(30, "minutes");

      let isOverlapping = bookedAppointments.some((appointment) => {
        const appointmentStart = moment(appointment.date);
        const appointmentEnd = appointmentStart
          .clone()
          .add(appointment.duration, "minutes");

        return (
          slotStartTime.isBefore(appointmentEnd) &&
          slotEndTime.isAfter(appointmentStart)
        );
      });

      return { slotTime: slot, status: isOverlapping ? "navl" : "avl" };
    });
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};


const computeAvailableSlots = async (doctorId, date) => {
  try {
    const wH = await getDoctorsWorkingTime(doctorId);
    const workingHoursStartTime = wH.start;
    const workingHoursEndTime = wH.end;

    const allSlots = createAllSlots(
      date,
      workingHoursStartTime,
      workingHoursEndTime
    );

    const bookedAppointments =
      await fetchBookedAppointmentsForDoctorForGivenDate(doctorId, date);
   
    const newSlotsAfterRemovingOverlappingSlots = removeOverlappingSlots(
      date,
      bookedAppointments,
      allSlots
    );
    
    return newSlotsAfterRemovingOverlappingSlots;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

module.exports = {
  getDoctors,
  createDoctor,
  computeAvailableSlots,
};