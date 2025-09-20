import React, { useEffect, useState } from "react";
import {QRCodeCanvas} from "qrcode.react";
import "./AdminDashboard.css";
import { FaPrint } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const AdminDashboard = () => {
  const [uploads, setUploads] = useState([]);
  const [message, setMessage] = useState("");
  const [shopUrl, setShopUrl] = useState("");

  // Get JWT token from localStorage
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  //const shopUrl= `http://localhost:3000/${username}`;

   useEffect(() => {
    if (username) {
      const frontendBase = window.location.origin; // e.g. http://localhost:3000
      setShopUrl(`${frontendBase}/${username}`);
    }
  }, [username]);

  // Fetch uploads from backend
  const fetchUploads = async () => {
    if (!token) {
      setMessage("Not logged in");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/uploads", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setUploads(data);
      else setMessage(data.msg || "Failed to fetch uploads");
    } catch (err) {
      console.error(err);
      setMessage("Server error while fetching uploads");
    }
  };

  useEffect(() => {
    fetchUploads();
    // Poll every 10s to update uploads list
    const interval = setInterval(fetchUploads, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Reference Name</th>
            <th>Original File</th>
            <th>Upload Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map((upload) => (
            <tr key={upload._id}>
              <td>{upload.refName || "-"}</td>
              <td>{upload.originalName}</td>
              <td>{new Date(upload.uploadTime).toLocaleString()}</td>
              <td>{upload.status}</td>
              <td>
                
                <button
                  onClick={() =>
                    window.open(
                      `http://localhost:5000/uploads/${upload.filename}`, 
                      "_blank"
                    )
                  }
                >
                  <FaPrint/>
                  Print
                </button>
                <button
  onClick={async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return; // stop if user clicks Cancel

    try {
      const res = await fetch(
        `http://localhost:5000/api/uploads/${upload._id}/delete`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) fetchUploads(); // refresh list
      else setMessage(data.msg || "Delete failed");
    } catch (err) {
      console.error(err);
      setMessage("Server error during delete");
    }
  }}
>
<MdDeleteOutline/>
  Delete
</button>

              </td>
            </tr>
          ))}
          {uploads.length === 0 && (
            <tr>
              <td colSpan="5">No uploads yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

