const prisma = require('../utils/prisma');
const { v4: uuidv4 } = require('uuid');

// @desc    Get all chapters
// @route   GET /api/chapters
// @access  Private
const getChapters = async (req, res) => {
  try {
    const { subjectId, bookId } = req.query;
    
    const where = {};

    if (subjectId) {
      where.subjectId = subjectId;
    }

    if (bookId) {
      where.subject = {
        books: {
          some: {
            bookId
          }
        }
      };
    }

    const chapters = await prisma.chapter.findMany({
      where,
      include: {
        subject: {
          include: {
            books: {
              include: {
                book: true
              }
            }
          }
        }
      },
      orderBy: { title: 'asc' }
    });

    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get single chapter
// @route   GET /api/chapters/:id
// @access  Private
const getChapterById = async (req, res) => {
  try {
    const { id } = req.params;

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        subject: {
          include: {
            books: {
              include: {
                book: true
              }
            }
          }
        }
      }
    });

    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    res.json(chapter);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create chapter
// @route   POST /api/chapters
// @access  Private
const createChapter = async (req, res) => {
  try {
    const { title, content, subjectId } = req.body;

    // Verify subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Generate QR code
    const qrCode = uuidv4();
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const qrContent = `${baseUrl}/api/chapters/qr/${qrCode}`;

    // Create chapter with QR code
    const chapter = await prisma.chapter.create({
      data: {
        title,
        content,
        subjectId,
        qrCode,
        qrContent
      },
      include: {
        subject: {
          include: {
            books: {
              include: {
                book: true
              }
            }
          }
        }
      }
    });

    res.status(201).json(chapter);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update chapter
// @route   PUT /api/chapters/:id
// @access  Private
const updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, subjectId } = req.body;

    // Verify subject exists if provided
    if (subjectId) {
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId }
      });

      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }
    }

    // Update chapter
    const chapter = await prisma.chapter.update({
      where: { id },
      data: {
        title,
        content,
        subjectId
      },
      include: {
        subject: {
          include: {
            books: {
              include: {
                book: true
              }
            }
          }
        }
      }
    });

    res.json(chapter);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete chapter
// @route   DELETE /api/chapters/:id
// @access  Private
const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete chapter
    await prisma.chapter.delete({
      where: { id }
    });

    res.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Handle QR code redirect
// @route   GET /api/chapters/qr/:qrCode
// @access  Public
const handleQRRedirect = async (req, res) => {
  try {
    const { qrCode } = req.params;

    const chapter = await prisma.chapter.findUnique({
      where: { qrCode },
      include: {
        subject: true
      }
    });

    if (!chapter) {
      return res.status(404).json({ error: 'QR code not found' });
    }

    // Generate HTML response
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${chapter.title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              color: #333;
              border-bottom: 2px solid #eee;
              padding-bottom: 10px;
            }
            .content {
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <h1>${chapter.title}</h1>
          <div class="content">
            ${chapter.content}
          </div>
        </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
  handleQRRedirect
};
