import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AppointmentList.css';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ patientName: '', appointmentType: '', notes: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    axios
      .get('http://localhost:8080/api/appointments')
      .then((response) => {
        setAppointments(response.data.appointments);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching appointments");
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/appointments/${id}`)
      .then((response) => {
        setMessage("Appointment deleted successfully");
        fetchAppointments();
      })
      .catch((err) => {
        setMessage("Error deleting appointment");
      });
  };

  const startEditing = (appointment) => {
    setEditingId(appointment._id);
    setEditData({
      patientName: appointment.patientName,
      appointmentType: appointment.appointmentType,
      notes: appointment.notes,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ patientName: '', appointmentType: '', notes: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e, id) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8080/api/appointments/${id}`, editData)
      .then((response) => {
        setMessage("Appointment updated successfully");
        setEditingId(null);
        fetchAppointments();
      })
      .catch((err) => {
        setMessage("Error updating appointment");
      });
  };

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="appointment-list">
      <h2>Upcoming Appointments</h2>
      {message && <p className="message">{message}</p>}
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment._id} className="appointment-item">
            {editingId === appointment._id ? (
              <form onSubmit={(e) => handleEditSubmit(e, appointment._id)}>
                <div className="form-group">
                  <label>Patient Name:</label>
                  <input
                    type="text"
                    name="patientName"
                    value={editData.patientName}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Appointment Type:</label>
                  <input
                    type="text"
                    name="appointmentType"
                    value={editData.appointmentType}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Notes:</label>
                  <textarea name="notes" value={editData.notes} onChange={handleEditChange}></textarea>
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={cancelEditing}>
                  Cancel
                </button>
              </form>
            ) : (
              <div className="appointment-details">
                <p>
                  <strong>Doctor:</strong> {appointment.doctorId?.name}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(appointment.date).toLocaleString()}
                </p>
                <p>
                  <strong>Patient:</strong> {appointment.patientName}
                </p>
                <p>
                  <strong>Type:</strong> {appointment.appointmentType}
                </p>
                <p>
                  <strong>Notes:</strong> {appointment.notes}
                </p>
                <div className="actions">
                  <button onClick={() => startEditing(appointment)}>Edit</button>
                  <button onClick={() => handleDelete(appointment._id)}>Cancel</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;
