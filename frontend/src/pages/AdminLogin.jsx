import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // save token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("adminToken", data.adminToken);
        setToken(data.token);
        navigate("/admin/dashboard");
      } else {
        setMessage(data.msg || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error during login");
    }
  };

  return (
    <div className="admin-form">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminLogin;
