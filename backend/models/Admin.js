const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  adminToken: { type: String, unique: true, default: function() { return this.username; } }
//  adminToken: { type: String, default: () => uuidv4() }, // QR token
});

AdminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  // Ensure adminToken always equals username on save (keeps consistent)
  this.adminToken = this.username;
  next();
});

/* AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
}); */

module.exports = mongoose.model('Admin', AdminSchema);


