import React, { useState } from "react";
import { updateDoctorProfile } from "../services/api.service";

function DoctorProfileSection({ userData }) {
  const [specialization, setSpecialization] = useState(userData.specialization || "");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await updateDoctorProfile(specialization);
      setMessage("Profile updated successfully! You can now be matched with patients.");
    } catch (err) {
      setMessage(`Error: ${err.toString()}`);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">Complete Your Doctor Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Specialization:</label>
          <input
            type="text"
            className="border border-gray-300 rounded w-full p-2"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Save Profile
        </button>
      </form>
      {message && <p className="mt-4 bg-yellow-100 p-2 rounded">{message}</p>}
    </div>
  );
}

export default DoctorProfileSection;
