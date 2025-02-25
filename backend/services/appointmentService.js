const Appointment = require("../models/Appointment");
const ApiError = require("../utils/ApiError");
const moment = require("moment")
async function getAppointments() {
  try {
    const Appointments = await Appointment.find({}).populate("doctorId");
    return Appointments;
  } catch (error) {
    throw new ApiError(404, "error.message");
  }
}

const getAppointmentById = async (id) => {
  try {
    const appointment = await Appointment.findOne({ _id: id });

    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }

    return appointment;
  } catch (error) {
    throw new ApiError(500, error.message || "Error fetching appointment");
  }
};

async function createAppointment(appointmentBody) {
  try {
    console.log("before : ", appointmentBody.date)
    appointmentBody.date = moment(appointmentBody.date).utc().toISOString();
    console.log("Final UTC Date Before Save:", appointmentBody.date); 
    console.log("Server Timezone:", Intl.DateTimeFormat().resolvedOptions().timeZone);
console.log("Current Server Time:", new Date().toISOString());

    const newAppointment = new Appointment(appointmentBody);
    await newAppointment.save();
    return newAppointment;
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to create appointment");
  }
}

const deleteAppointment = async (id) => {
  try {
    const appointmentToBeDeleted = await Appointment.findById(id);
    if (!appointmentToBeDeleted) {
      throw new ApiError(404, "Appointment not found");
    }
    await Appointment.deleteOne({ _id: id });
    const appointmentsAfterDeleting = await Appointment.find({}).populate('doctorId');
    return appointmentsAfterDeleting;
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to delete appointment");
  }
};


  async function editAppointment(id, body) {
    try {
      const appointmentToBeEdited = await Appointment.findById(id);
      
      if (!appointmentToBeEdited) {
        throw new ApiError(404, "Appointment not found");
      }
  
      await Appointment.updateOne({ _id: id }, body);
      
      const appointmentAfterEditing = await Appointment.findById(id);
      return appointmentAfterEditing;
    } catch (error) {
      throw new ApiError(500, error.message || "Failed to edit appointment");
    }
  }
  

module.exports = {
  getAppointments,
  createAppointment,
  getAppointmentById,
  deleteAppointment,
  editAppointment
};