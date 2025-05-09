const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const { validationResult } = require('express-validator');
const { extractChaptersFromPDF, extractChaptersFromExcel } = require('../utils/fileProcessor');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads', 'pdfs'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || ext === '.xlsx') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Excel files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const getSubjects = async (req, res) => {
  try {
    const { year } = req.query;
    const query = { user: req.user._id };  // Add user to query
    
    if (year) {
      query.year = year;
    }

    const subjects = await Subject.find(query)
      .populate('book', 'title')
      .sort({ createdAt: -1 });
      
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createSubject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, year, book } = req.body;

  try {
    const subject = await Subject.create({
      name,
      description,
      year,
      book,
      user: req.user._id  // Add user field here
    });

    // Populate book details before sending response
    const populatedSubject = await Subject.findById(subject._id)
      .populate('book', 'title');

    res.status(201).json(populatedSubject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadSubjectFile = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Request body:', req.body);
    console.log('File:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileContent = await fs.readFile(filePath);
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    let chapters;
    if (fileExt === '.pdf') {
      chapters = await extractChaptersFromPDF(fileContent);
    } else if (fileExt === '.xlsx') {
      chapters = await extractChaptersFromExcel(fileContent);
    }

    if (!chapters || chapters.length === 0) {
      await fs.unlink(filePath);
      return res.status(400).json({ message: 'No chapters found in the file' });
    }

    // Create subject name from file name
    const subjectName = path.basename(req.file.originalname, fileExt);
    const subject = await Subject.create({
      name: subjectName,
      description: `Subject created from ${req.file.originalname}`,
      year: req.body.year,
      book: req.body.book,
      user: req.user._id
    });

    // Create chapters
    const createdChapters = [];
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    for (const chapterData of chapters) {
      const chapter = await Chapter.create({
        title: chapterData.title,
        description: chapterData.content,
        subject: subject._id,
        qrContent: '',
        qrUrl: '',
        subQRs: []
      });

      const redirectUrl = `${baseUrl}/api/chapters/qr/${chapter.qrId}`;
      await Chapter.findByIdAndUpdate(
        chapter._id,
        { qrContent: redirectUrl }
      );

      const populatedChapter = await Chapter.findById(chapter._id)
        .populate('subject', 'name');
      
      createdChapters.push(populatedChapter);
    }

    // Clean up uploaded file
    await fs.unlink(filePath);

    res.status(201).json({
      subject,
      chapters: createdChapters
    });

  } catch (error) {
    console.error(error);
    // Clean up file if it exists
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  getSubjects,
  createSubject,
  uploadSubjectFile,
  upload
};
