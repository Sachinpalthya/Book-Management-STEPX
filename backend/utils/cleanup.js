const fs = require('fs').promises;
const path = require('path');
const Subject = require('../models/Subject');

const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const cleanupTempFiles = async () => {
  try {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'pdfs');
    const files = await fs.readdir(uploadDir);
    
    // Get list of PDF files referenced in database
    const subjects = await Subject.find({ pdfFileName: { $exists: true } });
    const activeFiles = new Set(subjects.map(s => s.pdfFileName).filter(Boolean));

    for (const file of files) {
      // Skip if file is referenced in database
      if (activeFiles.has(file)) continue;

      const filePath = path.join(uploadDir, file);
      const stats = await fs.stat(filePath);
      const age = Date.now() - stats.mtime.getTime();

      // Remove files older than 24 hours that aren't referenced
      if (age > ONE_DAY) {
        await fs.unlink(filePath);
        console.log(`Removed old temp file: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
};

// Run cleanup every 12 hours
setInterval(cleanupTempFiles, 12 * 60 * 60 * 1000);

// Export for manual cleanup
module.exports = { cleanupTempFiles };