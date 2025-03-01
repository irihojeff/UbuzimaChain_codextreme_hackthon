// File: src/components/Login.jsx
import React, { useState } from "react";
import { loginUser } from "../services/api.service";
import { useNavigate } from "react-router-dom";

function Login({ setCurrentUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const authResponse = await loginUser({ username, password });
      // In a real app, you'd store the token in local storage or context
      // For now, let's just fetch the user data from the response
      const user = {
        id: authResponse.user_id,
        username: authResponse.username,
      };
      setCurrentUser(user);
      setMessage("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      setMessage(`Login error: ${JSON.stringify(err)}`);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
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

        <button type="submit">Login</button>
      </form>
      {message && <p className="message-box">{message}</p>}
    </div>
  );
}

export default Login;
