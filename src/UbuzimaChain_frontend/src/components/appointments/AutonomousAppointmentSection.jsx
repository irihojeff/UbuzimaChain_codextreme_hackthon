// File: src/components/appointments/AutonomousAppointmentSection.jsx
import React, { useState } from "react";
import { createAutonomousAppointment } from "../../services/api.service";

function AutonomousAppointmentSection({ userData }) {
  const [symptoms, setSymptoms] = useState("");
  const [desiredTime, setDesiredTime] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const payload = {
        patient_id: userData.id,
        symptoms,
        desired_time: desiredTime ? Number(desiredTime) : null,
        notes: notes || null,
      };
      const appointmentId = await createAutonomousAppointment(payload);
      setMessage(`Appointment booked! ID: ${appointmentId}`);
      setSymptoms("");
      setDesiredTime("");
      setNotes("");
    } catch (err) {
      setMessage(`Error: ${JSON.stringify(err)}`);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Describe your symptoms:</label>
          <textarea
            className="border border-gray-300 rounded w-full p-2"
            rows="3"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Desired Time (Unix Timestamp):</label>
          <input
            type="number"
            className="border border-gray-300 rounded w-full p-2"
            value={desiredTime}
            onChange={(e) => setDesiredTime(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Additional Notes (optional):</label>
          <input
            type="text"
            className="border border-gray-300 rounded w-full p-2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
      {message && <p className="mt-4 bg-yellow-100 p-2 rounded">{message}</p>}
    </div>
  );
}

export default AutonomousAppointmentSection;
