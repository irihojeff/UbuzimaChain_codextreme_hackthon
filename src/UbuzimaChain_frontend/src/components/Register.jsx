// File: src/components/Register.jsx
import React, { useState } from "react";
import { registerUser } from "../services/api.service";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Patient");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const userId = await registerUser({ username, password }, role);
      setMessage(`Registration successful! User ID: ${userId}`);
      setUsername("");
      setPassword("");
      setRole("Patient");
    } catch (error) {
      setMessage(`Error: ${JSON.stringify(error)}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Username</label>
          <input
            type="text"
            className="border border-gray-300 rounded w-full px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="border border-gray-300 rounded w-full px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Role</label>
          <select
            className="border border-gray-300 rounded w-full px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Register
        </button>
      </form>
      {message && <p className="mt-4 bg-yellow-100 p-2 rounded">{message}</p>}
    </div>
  );
}

export default Register;
