import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DoctorList.css';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/doctors')
      .then((response) => {
        setDoctors(response.data.doctors);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching doctors");
        setLoading(false);
      });
  }, []);

  const handleDoctorSelect = (doctorId) => {
    navigate(`/booking/${doctorId}`);
  };

  if (loading) return <div>Loading doctors...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="doctor-list">
      <h2>Select a Doctor</h2>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor._id} onClick={() => handleDoctorSelect(doctor._id)}>
            <h3>{doctor.name}</h3>
            <p>{doctor.specialization}</p>
            <p>
              Working Hours: {doctor.workingHours.start} - {doctor.workingHours.end}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
