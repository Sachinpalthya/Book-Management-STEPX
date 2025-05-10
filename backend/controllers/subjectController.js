const prisma = require('../utils/prisma');
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

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res) => {
  try {
    const { branchId, academicYearId } = req.query;
    
    const where = {
      isDeleted: false
    };

    if (branchId) {
      where.branchId = parseInt(branchId);
    }

    if (academicYearId) {
      where.academicYearId = parseInt(academicYearId);
    }

    const subjects = await prisma.subject.findMany({
      where,
      include: {
        branch: true,
        academicYear: true,
        books: {
          include: {
            book: true
          }
        },
        _count: {
          select: {
            chapters: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create subject
// @route   POST /api/subjects
// @access  Private
const createSubject = async (req, res) => {
  try {
    const { name, description, branchId, academicYearId, bookIds } = req.body;

    // Verify branch and academic year exist
    const [branch, academicYear] = await Promise.all([
      branchId ? prisma.branch.findUnique({ where: { id: parseInt(branchId) } }) : null,
      academicYearId ? prisma.academicYear.findUnique({ where: { id: parseInt(academicYearId) } }) : null
    ]);

    if (branchId && !branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    if (academicYearId && !academicYear) {
      return res.status(404).json({ error: 'Academic year not found' });
    }

    // Create subject with books
    const subject = await prisma.subject.create({
      data: {
        name,
        description,
        // branchId: branchId ? parseInt(branchId) : null,
        // academicYearId: academicYearId ? parseInt(academicYearId) : null,
        userId: req.user.id,
        createdById: req.user.id,
        updatedById: req.user.id,
        books: bookIds ? {
          create: bookIds.map(bookId => ({
            book: { connect: { id: bookId } }
          }))
        } : undefined
      },
      include: {
        // branch: true,
        // academicYear: true
      }
    });

    res.status(201).json(subject);
  } catch (error) {
    console.log(error); 
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, branchId, academicYearId, bookIds } = req.body;

    // Verify branch and academic year exist
    const [branch, academicYear] = await Promise.all([
      branchId ? prisma.branch.findUnique({ where: { id: parseInt(branchId) } }) : null,
      academicYearId ? prisma.academicYear.findUnique({ where: { id: parseInt(academicYearId) } }) : null
    ]);

    if (branchId && !branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    if (academicYearId && !academicYear) {
      return res.status(404).json({ error: 'Academic year not found' });
    }

    // Update subject
    const subject = await prisma.subject.update({
      where: { id },
      data: {
        name,
        description,
        branchId: branchId ? parseInt(branchId) : null,
        academicYearId: academicYearId ? parseInt(academicYearId) : null,
        updatedById: req.user.id,
        books: bookIds ? {
          deleteMany: {},
          create: bookIds.map(bookId => ({
            book: { connect: { id: bookId } }
          }))
        } : undefined
      },
      include: {
        branch: true,
        academicYear: true,
        books: {
          include: {
            book: true
          }
        }
      }
    });

    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete subject (soft delete)
// @route   DELETE /api/subjects/:id
// @access  Private
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if subject has chapters
    const chaptersCount = await prisma.chapter.count({
      where: { subjectId: id }
    });

    if (chaptersCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete subject as it has associated chapters' 
      });
    }

    // Soft delete
    await prisma.subject.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        updatedById: req.user.id
      }
    });

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
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
    const subject = await prisma.subject.create({
      data: {
        name: subjectName,
        description: `Subject created from ${req.file.originalname}`,
        year: req.body.year,
        userId: req.user.id,
        createdById: req.user.id,
        updatedById: req.user.id,
        books: req.body.book ? {
          connect: {
            id: req.body.book
          }
        } : undefined
      },
      include: {
        books: req.body.book ? {
          include: {
            book: true
          }
        } : undefined
      }
    });

    // Create chapters
    const createdChapters = [];
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    for (const chapterData of chapters) {
      const chapter = await prisma.chapter.create({
        data: {
          title: chapterData.title,
          description: chapterData.content,
          subjectId: subject.id,
          qrContent: '',
          qrUrl: '',
          subQRs: []
        },
        include: {
          subject: true
        }
      });

      const redirectUrl = `${baseUrl}/api/chapters/qr/${chapter.qrId}`;
      await prisma.chapter.update({
        where: { id: chapter.id },
        data: { qrContent: redirectUrl }
      });

      const populatedChapter = await prisma.chapter.findUnique({
        where: { id: chapter.id },
        include: {
          subject: true
        }
      });
      
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
  updateSubject,
  deleteSubject,
  uploadSubjectFile,
  upload
};
