const prisma = require('../utils/prisma');

// @desc    Get all books
// @route   GET /api/books
// @access  Private
const getBooks = async (req, res) => {
  try {
    const { subjectId, branchId, academicYearId } = req.query;
    
    const where = {
      isDeleted: false
    };

    if (subjectId) {
      where.subjects = {
        some: {
          subjectId
        }
      };
    }

    if (branchId) {
      where.branchId = parseInt(branchId);
    }

    if (academicYearId) {
      where.academicYearId = parseInt(academicYearId);
    }

    const books = await prisma.book.findMany({
      where,
      include: {
        branch: true,
        academicYear: true,
        subjects: {
          include: {
            subject: true
          }
        },
        _count: {
          select: {
            subjects: true
          }
        }
      },
      orderBy: { title: 'asc' }
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Private
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        branch: true,
        academicYear: true,
        subjects: {
          include: {
            subject: true
          }
        }
      }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
  try {
    const { title, description, publisher, branchId, academicYearId, subjectIds } = req.body;

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

    // Create book with subjects
    const book = await prisma.book.create({
      data: {
        title,
        description,
        publisher,
        branchId: branchId ? parseInt(branchId) : null,
        academicYearId: academicYearId ? parseInt(academicYearId) : null,
        userId: req.user.id,
        createdById: req.user.id,
        updatedById: req.user.id,
        subjects: subjectIds ? {
          create: subjectIds.map(subjectId => ({
            subject: { connect: { id: subjectId } }
          }))
        } : undefined
      },
      include: {
        branch: true,
        academicYear: true,
        subjects: {
          include: {
            subject: true
          }
        }
      }
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, publisher, branchId, academicYearId, subjectIds } = req.body;

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

    // Update book
    const book = await prisma.book.update({
      where: { id },
      data: {
        title,
        description,
        publisher,
        branchId: branchId ? parseInt(branchId) : null,
        academicYearId: academicYearId ? parseInt(academicYearId) : null,
        updatedById: req.user.id,
        subjects: subjectIds ? {
          deleteMany: {},
          create: subjectIds.map(subjectId => ({
            subject: { connect: { id: subjectId } }
          }))
        } : undefined
      },
      include: {
        branch: true,
        academicYear: true,
        subjects: {
          include: {
            subject: true
          }
        }
      }
    });

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete book (soft delete)
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if book has subjects
    const subjectsCount = await prisma.bookSubject.count({
      where: { bookId: id }
    });

    if (subjectsCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete book as it has associated subjects' 
      });
    }

    // Soft delete
    await prisma.book.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        updatedById: req.user.id
      }
    });

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
}; 
