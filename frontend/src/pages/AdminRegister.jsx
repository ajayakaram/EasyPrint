import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminRegister.css";

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !username || !password) {
      setMessage("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Admin registered successfully! Use login now.");
        setTimeout(() => navigate("/admin/login"), 1500);
      } else {
        setMessage(data.msg || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error during registration");
    }
  };

  return (
    <div className="admin-form">
      <h2>Admin Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminRegister;
