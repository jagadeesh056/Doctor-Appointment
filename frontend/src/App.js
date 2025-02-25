import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DoctorList from './components/DoctorList';
import AppointmentBooking from './components/AppointmentBooking';
import AppointmentList from './components/AppointmentList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>BabySteps Appointment Booking</h1>
          <nav>
            <Link to="/">Doctors</Link>
            <Link to="/appointments">My Appointments</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<DoctorList />} />
            <Route path="/booking/:doctorId" element={<AppointmentBooking />} />
            <Route path="/appointments" element={<AppointmentList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
