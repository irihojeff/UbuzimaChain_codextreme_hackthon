import React, { useState } from "react";
import { createAutonomousAppointment } from "../../services/api.service";

const scenarioOptions = [
  {
    label: "Tooth Pain",
    symptoms: "I woke up with severe tooth pain",
    notes: "Need urgent dental care",
  },
  {
    label: "Headache",
    symptoms: "Persistent headache since morning",
    notes: "Looking for a neurologist",
  },
  {
    label: "Stomach Ache",
    symptoms: "Severe stomach pain and nausea",
    notes: "Suspect food poisoning, need urgent care",
  },
  {
    label: "Custom",
    symptoms: "",
    notes: "",
  },
];

function AutonomousAppointmentSection({ userData }) {
  const [scenario, setScenario] = useState("Custom");
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const handleScenarioChange = (e) => {
    const selected = e.target.value;
    setScenario(selected);
    const option = scenarioOptions.find((opt) => opt.label === selected);
    if (option && selected !== "Custom") {
      setSymptoms(option.symptoms);
      setNotes(option.notes);
    } else {
      setSymptoms("");
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
        notes: notes || null,
      };
      const appointmentId = await createAutonomousAppointment(payload);
      setMessage(`Appointment booked! Appointment ID: ${appointmentId}`);
      setSymptoms("");
      setNotes("");
      setScenario("Custom");
    } catch (err) {
      setMessage(`Error: ${err.toString()}`);
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
      {message && <p className="mt-4 bg-yellow-100 p-2 rounded">{message}</p>}
    </div>
  );
}

export default AutonomousAppointmentSection;
