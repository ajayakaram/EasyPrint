const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Use a strong secret from .env
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_here";

const auth = async (req, res, next) => {
  try {
    // 1️⃣ Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3️⃣ Get admin from DB
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ msg: "Token invalid or expired" });

    // 4️⃣ Attach admin to request object
    req.admin = admin;

    next(); // proceed to next middleware/route
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Token invalid or expired" });
  }
};

module.exports = auth;

