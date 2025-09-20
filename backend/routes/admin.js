/* const express = require('express');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // same as you have

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password)
      return res.status(400).json({ msg: 'All fields are required' });

    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ msg: 'Username already exists' });

    const admin = new Admin({ name, username, password });
    await admin.save();

    res.json({ msg: 'Admin registered', adminToken: admin.adminToken });
   // res.json({ msg: 'Admin registered', '/shop/${admin.username}'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ msg: 'All fields are required' });

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, adminToken: admin.adminToken, name: admin.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Optional: get current admin
router.get('/me', auth, async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select('-password');
  res.json(admin);
});

module.exports = router; */

const express = require('express');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password)
      return res.status(400).json({ msg: 'All fields are required' });

    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ msg: 'Username already exists' });

    const admin = new Admin({ name, username, password });
    await admin.save();

    // we use username instead of random token
    res.json({ msg: 'Admin registered', shopLink: `/${admin.username}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ msg: 'All fields are required' });

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

    // return username instead of token
    res.json({ token, username: admin.username, name: admin.name, shopLink: `/shop/${admin.username}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get current admin
router.get('/me', auth, async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select('-password');
  res.json(admin);
});

module.exports = router;

