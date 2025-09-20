const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Admin = require("../models/Admin");
const Upload = require("../models/Upload");
const auth = require("../middleware/auth");

const router = express.Router();

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, filename);
  },
});
const upload = multer({ storage });

// parse expiry helper
function parseExpiryToDate(expiry) {
  const now = Date.now();
  if (!expiry) return new Date(now + 15 * 60 * 1000);
  const m = expiry.match(/^(\d+)(m|h|d)$/i);
  if (!m) return new Date(now + 15 * 60 * 1000);
  const val = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  if (unit === "m") return new Date(now + val * 60 * 1000);
  if (unit === "h") return new Date(now + val * 60 * 60 * 1000);
  if (unit === "d") return new Date(now + val * 24 * 60 * 60 * 1000);
  return new Date(now + 15 * 60 * 1000);
}

// === UPLOAD FILE (public via username) ===
router.post("/upload/:username", upload.single("file"), async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.params.username });
    if (!admin) {
      if (req.file && req.file.path) fs.unlink(req.file.path, () => {});
      return res.status(404).json({ msg: "Shop not found" });
    }
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const expiryTime = parseExpiryToDate(req.body.expiry);
    const newUpload = new Upload({
      admin: admin._id,
      originalName: req.file.originalname,
      filename: req.file.filename,
      refName: req.body.refName || "",
      expiryTime,
    });
    await newUpload.save();
    res.json({ msg: "Uploaded", uploadId: newUpload._id, expiryTime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// === LIST UPLOADS (admin only) ===
router.get("/admin/uploads", auth, async (req, res) => {
  const uploads = await Upload.find({ admin: req.admin._id }).sort({ uploadTime: -1 }).lean();
  res.json(uploads);
});

// === SERVE FILE (admin only) ===
router.get("/uploads/:id/file", auth, async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ msg: "Upload not found" });
    if (!upload.admin.equals(req.admin._id)) return res.status(403).json({ msg: "Forbidden" });
    if (upload.status === "deleted") return res.status(404).json({ msg: "File deleted" });

    const filePath = path.join(__dirname, "..", "uploads", upload.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ msg: "File not found" });

    res.setHeader("Content-Disposition", `inline; filename="${upload.originalName}"`);
    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// === DELETE FILE (admin only) ===
router.post("/uploads/:id/delete", auth, async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ msg: "Upload not found" });
    if (!upload.admin.equals(req.admin._id)) return res.status(403).json({ msg: "Forbidden" });

    const filePath = path.join(__dirname, "..", "uploads", upload.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    upload.status = "deleted";
    await upload.save();
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
