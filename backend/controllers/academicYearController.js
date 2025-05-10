const prisma = require('../utils/prisma');

// @desc    Get all academic years
// @route   GET /api/academic-years
// @access  Private
const getAcademicYears = async (req, res) => {
  try {
    const academicYears = await prisma.academicYear.findMany({
      orderBy: { label: 'desc' }
    });
    res.json(academicYears);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create academic year
// @route   POST /api/academic-years
// @access  Private (Admin only)
const createAcademicYear = async (req, res) => {
  try {
    const { label } = req.body;

    const existingYear = await prisma.academicYear.findUnique({
      where: { label }
    });

    if (existingYear) {
      return res.status(400).json({ error: 'Academic year already exists' });
    }

    const academicYear = await prisma.academicYear.create({
      data: {
        label,
        createdById: req.user.id,
        updatedById: req.user.id
      }
    });

    res.status(201).json(academicYear);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update academic year
// @route   PUT /api/academic-years/:id
// @access  Private (Admin only)
const updateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { label } = req.body;

    const existingYear = await prisma.academicYear.findUnique({
      where: { label }
    });

    if (existingYear && existingYear.id !== parseInt(id)) {
      return res.status(400).json({ error: 'Academic year already exists' });
    }

    const academicYear = await prisma.academicYear.update({
      where: { id: parseInt(id) },
      data: {
        label,
        updatedById: req.user.id
      }
    });

    res.json(academicYear);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete academic year
// @route   DELETE /api/academic-years/:id
// @access  Private (Admin only)
const deleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if academic year is being used
    const booksCount = await prisma.book.count({
      where: { academicYearId: parseInt(id) }
    });

    const subjectsCount = await prisma.subject.count({
      where: { academicYearId: parseInt(id) }
    });

    if (booksCount > 0 || subjectsCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete academic year as it is being used by books or subjects' 
      });
    }

    await prisma.academicYear.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Academic year deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear
}; 