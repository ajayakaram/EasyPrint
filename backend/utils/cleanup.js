// utils/cleanup.js
const cron = require('node-cron');
const Upload = require('../models/Upload');
const path = require('path');
const fs = require('fs');

/**
 * Runs every minute: finds uploads with expiryTime <= now and status pending,
 * deletes file from disk and marks status deleted.
 */
function startCleanup() {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const expired = await Upload.find({ expiryTime: { $lte: now }, status: 'pending' });
      for (const u of expired) {
        const filePath = path.join(__dirname, '..', 'uploads', u.filename);
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
        }
        u.status = 'deleted';
        await u.save();
        console.log(`Auto-deleted file ${u.filename} (upload ${u._id})`);
      }
    } catch (err) {
      console.error('Cleanup error', err);
    }
  });

  console.log('Cleanup job started (every minute)');
}

module.exports = startCleanup;
