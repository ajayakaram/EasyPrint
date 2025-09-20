import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShopPage from "./pages/ShopPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegister from "./pages/AdminRegister";
import AdminLogin from "./pages/AdminLogin";
import Home from "./pages/Home"; // 

import { useState } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />  {/* Home page */}
        <Route path="/:shopId" element={<ShopPage />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin setToken={setToken} />} />
        <Route path="/admin/dashboard" element={<AdminDashboard token={token} />} />
      </Routes>
    </Router>
  );
}

export default App;

