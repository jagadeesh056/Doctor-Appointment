import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AppointmentBooking.css';

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  const [patientName, setPatientName] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchSlots();
  }, [doctorId, selectedDate]);

  function getToday() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  const fetchSlots = () => {
    setLoadingSlots(true);
    axios
      .get(`http://localhost:8080/api/doctors/${doctorId}/slots?date=${selectedDate}`)
      .then((response) => {
        setSlots(response.data.slots);
        setLoadingSlots(false);
        setSlotError(null);
      })
      .catch((error) => {
        setSlotError("Error fetching slots");
        setLoadingSlots(false);
      });
  };

  const upcomingDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      days.push(nextDay.toISOString().split('T')[0]);
    }
    return days;
  };

  const handleSlotClick = (slot) => {
    if (slot.status === 'avl') {
      setSelectedSlot(slot.slotTime);
      setBookingSuccess('');
      setBookingError('');
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!patientName || !appointmentType) {
      setBookingError("Please fill in all required fields");
      return;
    }
    const appointmentDateTime = `${selectedDate}T${selectedSlot}:00.000Z`;

    const appointmentData = {
      doctorId,
      date: appointmentDateTime,
      duration: 30,
      appointmentType,
      patientName,
      notes,
    };

    axios
      .post('http://localhost:8080/api/appointments', appointmentData)
      .then((response) => {
        setBookingSuccess("Appointment booked successfully");
        setSelectedSlot(null);
        setPatientName('');
        setAppointmentType('');
        setNotes('');
        fetchSlots();
      })
      .catch((error) => {
        setBookingError("Failed to book appointment");
      });
  };

  return (
    <div className="appointment-booking">
      <h2>Book Appointment</h2>
      <div className="date-picker">
        <label>Select Date: </label>
        <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
          {upcomingDays().map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
      <div className="slots-container">
        {loadingSlots ? (
          <p>Loading slots...</p>
        ) : slotError ? (
          <p>{slotError}</p>
        ) : (
          <ul className="slots-list">
            {slots.map((slot, index) => (
              <li
                key={index}
                className={slot.status === 'avl' ? 'slot available' : 'slot booked'}
                onClick={() => handleSlotClick(slot)}
              >
                {slot.slotTime} - {slot.status === 'avl' ? 'Available' : 'Booked'}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedSlot && (
        <div className="booking-form">
          <h3>
            Book Slot at {selectedSlot} on {selectedDate}
          </h3>
          {bookingSuccess && <p className="success-message">{bookingSuccess}</p>}
          {bookingError && <p className="error-message">{bookingError}</p>}
          <form onSubmit={handleBookingSubmit}>
            <div className="form-group">
              <label>Patient Name:</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Appointment Type:</label>
              <input
                type="text"
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Notes:</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
            </div>
            <button type="submit">Confirm Booking</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;
