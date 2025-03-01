// File: src/components/appointments/AppointmentSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  createAppointment,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
} from "../../services/api.service";

function AppointmentSection({ userData }) {
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  // A reusable function to fetch appointments based on role.
  const fetchAppointments = useCallback(async () => {
    try {
      let appts = [];
      if (userData.role && userData.role.Doctor !== undefined) {
        // For a doctor, fetch appointments assigned to them.
        appts = await getAppointmentsByDoctor(userData.id);
      } else if (userData.role && userData.role.Patient !== undefined) {
        // For a patient, fetch appointments they created.
        appts = await getAppointmentsByPatient(userData.id);
      }
      setAppointments(appts);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setMessage(`Error fetching appointments: ${JSON.stringify(err)}`);
    }
  }, [userData]);

  // Fetch appointments on mount
  useEffect(() => {
    if (userData) {
      fetchAppointments();
    }
  }, [userData, fetchAppointments]);

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      // Make sure scheduledTime is a number (Unix timestamp)
      const appointmentId = await createAppointment(
        doctorId,
        userData.id,
        Number(scheduledTime),
        notes || null
      );
      setMessage(`Appointment created! ID: ${appointmentId}`);
      setDoctorId("");
      setScheduledTime("");
      setNotes("");
      // Refresh the appointment list
      fetchAppointments();
    } catch (err) {
      setMessage(`Error creating appointment: ${JSON.stringify(err)}`);
    }
  };

  return (
    <div className="appointment-section">
      <h3>Appointments</h3>
      {/* For Patients: Form to create new appointment */}
      {userData.role && userData.role.Patient !== undefined && (
        <form onSubmit={handleCreateAppointment}>
          <label>Doctor ID</label>
          <input
            type="text"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            required
          />

          <label>Scheduled Time (Unix Timestamp)</label>
          <input
            type="number"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            required
          />

          <label>Notes (optional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button type="submit">Create Appointment</button>
        </form>
      )}
      <button onClick={fetchAppointments} style={{ marginTop: "1rem" }}>
        Refresh Appointments
      </button>
      {message && <p className="message-box">{message}</p>}
      <h4>My Appointments</h4>
      {appointments.length > 0 ? (
        <ul>
          {appointments.map((appt) => (
            <li key={appt.id}>
              <strong>ID:</strong> {appt.id} | <strong>Doctor:</strong>{" "}
              {appt.doctor_id} | <strong>Patient:</strong> {appt.patient_id} |{" "}
              <strong>Status:</strong> {appt.status} | <strong>Time:</strong>{" "}
              {appt.scheduled_time}
            </li>
          ))}
        </ul>
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );
}

export default AppointmentSection;
