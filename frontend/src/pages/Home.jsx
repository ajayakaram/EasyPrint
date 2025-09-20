import React from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Easy Print</h1>
      <p>Scan a shop QR code to start uploading your document.</p>
      <p>Or for testing, you can:</p>
  
      <div className="home-links">
        <Link to="/admin/register"><FaUserPlus /> Admin Register</Link> |{" "}
        <Link to="/admin/login"><FaSignInAlt /> Admin Login</Link>

      </div>
      <h3 className="user-login-ex">Users Don't Need To Log-In</h3>
    </div>
  );
};

export default Home;

