const appointmentService = require("../services/appointmentService");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const getAppointments = catchAsync(async (req, res) => {
  const appointments = await appointmentService.getAppointments();
  res.status(200).json({ appointments });
});

const getAppointmentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const appointment = await appointmentService.getAppointmentById(id);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  res.status(200).json({ appointment });
});

const createAppointment = catchAsync(async (req, res) => {
  let newAppointment = await appointmentService.createAppointment(req.body);
  let resObj = {
    appointment: newAppointment,
    message: "Created appointment successfully",
  };
  res.status(201).json(resObj);
});

const deleteAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const appointmentAfterDeleting =
    await appointmentService.deleteAppointment(id);
  if (!appointmentAfterDeleting) {
    throw new ApiError(404, "Appointment not found");
  }
  res.status(200).json({ appointments: appointmentAfterDeleting });
});

const editAppointment = catchAsync(async (req, res) => {
    let appointmentAfterEditing = await appointmentService.editAppointment(req.params.id, req.body);
    let resObj = {
      appointment: appointmentAfterEditing,
    };
    res.status(200).json(resObj);
  });


module.exports = {
  getAppointments,
  createAppointment,
  getAppointmentById,
  deleteAppointment,
  editAppointment
};