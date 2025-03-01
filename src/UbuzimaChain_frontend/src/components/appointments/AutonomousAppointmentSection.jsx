// File: src/components/appointments/AutonomousAppointmentSection.jsx
import React, { useState } from "react";
import { createAutonomousAppointment } from "../../services/api.service";

const scenarioOptions = [
  {
    label: "Tooth Pain",
    symptoms: "I woke up with severe tooth pain",
    desiredTime: "",
    notes: "Need urgent dental care",
  },
  {
    label: "Headache",
    symptoms: "Persistent headache since morning",
    desiredTime: "",
    notes: "Looking for a neurologist",
  },
  {
    label: "Stomach Ache",
    symptoms: "Severe stomach pain and nausea",
    desiredTime: "",
    notes: "Suspect food poisoning, need urgent care",
  },
  {
    label: "Custom",
    symptoms: "",
    desiredTime: "",
    notes: "",
  },
];

function AutonomousAppointmentSection({ userData }) {
  const [scenario, setScenario] = useState("Custom");
  const [symptoms, setSymptoms] = useState("");
  const [desiredTime, setDesiredTime] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const handleScenarioChange = (e) => {
    const selected = e.target.value;
    setScenario(selected);
    const option = scenarioOptions.find((opt) => opt.label === selected);
    if (option && selected !== "Custom") {
      setSymptoms(option.symptoms);
      setDesiredTime(option.desiredTime);
      setNotes(option.notes);
    } else {
      setSymptoms("");
      setDesiredTime("");
      setNotes("");
    }
  };

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
      setMessage(`Appointment booked! Appointment ID: ${appointmentId}`);
      setSymptoms("");
      setDesiredTime("");
      setNotes("");
      setScenario("Custom");
    } catch (err) {
      setMessage(`Error: ${JSON.stringify(err)}`);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>
      <div className="mb-4">
        <label className="block mb-1">Select a scenario:</label>
        <select
          className="border border-gray-300 rounded w-full p-2"
          value={scenario}
          onChange={handleScenarioChange}
        >
          {scenarioOptions.map((opt) => (
            <option key={opt.label} value={opt.label}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
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
          <label className="block mb-1">
            Desired Time (Unix Timestamp, optional):
          </label>
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
          Book Appointment
        </button>
      </form>
      {message && (
        <p className="mt-4 bg-yellow-100 p-2 rounded">{message}</p>
      )}
    </div>
  );
}

export default AutonomousAppointmentSection;
