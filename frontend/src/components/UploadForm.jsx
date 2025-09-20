import React, { useState } from "react";
import "./UploadForm.css";

const UploadForm = ({ adminToken }) => {
  const [file, setFile] = useState(null);
  const [reference, setReference] = useState("");
  const [timer, setTimer] = useState("10"); // default 10 mins
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("refName", reference); // backend expects refName
    formData.append("expiry", timer + "m"); // backend expects e.g., "10m"

    try {
      const res = await fetch(`http://localhost:5000/api/upload/${adminToken}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) setMessage(`File uploaded successfully! Expiry: ${data.expiryTime}`);
      else setMessage(data.msg || "Upload failed.");
    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <h2>Upload Your Document</h2>

      <input type="file" onChange={handleFileChange} />
      <input
        className="Reference-name"
        type="text"
        placeholder="Reference Name (optional)"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
      />

      <select className="select "value={timer} onChange={(e) => setTimer(e.target.value)}>
        <option value="10">10 mins</option>
        <option value="30">30 mins</option>
        <option value="60">1 hour</option>
      </select>

      <button type="submit">Upload</button>

      {message && <p className="message">{message}</p>}
    </form>
  );
};

export default UploadForm;
