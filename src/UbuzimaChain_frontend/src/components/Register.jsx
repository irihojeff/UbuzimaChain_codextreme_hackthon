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
      setMessage(`User registered successfully. ID: ${userId}`);
      setUsername("");
      setPassword("");
      setRole("Patient");
    } catch (err) {
      setMessage(`Error: ${JSON.stringify(err)}`);
    }
  };

  return (
    <div className="register-container">
      <h1>Register New User</h1>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input 
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required 
        />

        <label>Password</label>
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />

        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit">Register</button>
      </form>
      {message && <p className="message-box">{message}</p>}
    </div>
  );
}

export default Register;
