// In src/components/appointments/AutonomousAppointmentSection.jsx
import React, { useState } from "react";
import { createAutonomousAppointment } from "../../services/api.service";

function AutonomousAppointmentSection({ currentUser }) {
  const [symptoms, setSymptoms] = useState("");
  const [desiredTime, setDesiredTime] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patient_id: currentUser.id,
        symptoms,
        desired_time: desiredTime ? Number(desiredTime) : null,
        notes: notes || null,
      };
      const appointmentId = await createAutonomousAppointment(payload);
      setMessage(`Appointment booked successfully with ID: ${appointmentId}`);
      // Reset form
      setSymptoms("");
      setDesiredTime("");
      setNotes("");
    } catch (error) {
      setMessage(`Error booking appointment: ${JSON.stringify(error)}`);
    }
  };

  return (
    <div className="appointment-section">
      <h3>Book an Appointment</h3>
      <form onSubmit={handleSubmit}>
        <label>Describe your symptoms:</label>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          required
        />

        <label>Desired Time (Unix timestamp, optional):</label>
        <input
          type="number"
          value={desiredTime}
          onChange={(e) => setDesiredTime(e.target.value)}
        />

        <label>Additional Notes (optional):</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button type="submit">Book Appointment</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AutonomousAppointmentSection;
