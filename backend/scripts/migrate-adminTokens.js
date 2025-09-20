// scripts/migrate-adminTokens.js
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin'); // adjust path if script lives elsewhere

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const admins = await Admin.find();
  for (const a of admins) {
    if (a.adminToken !== a.username) {
      console.log(`Updating ${a.username}: ${a.adminToken} -> ${a.username}`);
      a.adminToken = a.username;
      await a.save();
    }
  }
  console.log('Done.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
