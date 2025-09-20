// models/Upload.js
const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  originalName: { type: String, required: true },
  filename: { type: String, required: true }, // on disk
  refName: { type: String, default: '' },
  uploadTime: { type: Date, default: Date.now },
  expiryTime: { type: Date, required: true },
  status: { type: String, enum: ['pending','printed','deleted'], default: 'pending' }
});

module.exports = mongoose.model('Upload', UploadSchema);
