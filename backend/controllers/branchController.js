const prisma = require('../utils/prisma');

// @desc    Get all branches
// @route   GET /api/branches
// @access  Private
const getBranches = async (req, res) => {
  try {
    const { academicYearId } = req.query;
    
    const where = {};
    if (academicYearId) {
      where.books = {
        some: {
          academicYearId: parseInt(academicYearId)
        }
      };
    }

    const branches = await prisma.branch.findMany({
      where,
      include: {
        _count: {
          select: {
            books: true,
            subjects: true,
            users: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create branch
// @route   POST /api/branches
// @access  Private (Admin only)
const createBranch = async (req, res) => {
  try {
    const { name, location } = req.body;

    const existingBranch = await prisma.branch.findUnique({
      where: { name }
    });

    if (existingBranch) {
      return res.status(400).json({ error: 'Branch already exists' });
    }

    const branch = await prisma.branch.create({
      data: {
        name,
        location,
        createdById: req.user.id,
        updatedById: req.user.id
      }
    });

    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update branch
// @route   PUT /api/branches/:id
// @access  Private (Admin only)
const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    const existingBranch = await prisma.branch.findUnique({
      where: { name }
    });

    if (existingBranch && existingBranch.id !== parseInt(id)) {
      return res.status(400).json({ error: 'Branch name already exists' });
    }

    const branch = await prisma.branch.update({
      where: { id: parseInt(id) },
      data: {
        name,
        location,
        updatedById: req.user.id
      }
    });

    res.json(branch);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete branch
// @route   DELETE /api/branches/:id
// @access  Private (Admin only)
const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if branch is being used
    const booksCount = await prisma.book.count({
      where: { branchId: parseInt(id) }
    });

    const subjectsCount = await prisma.subject.count({
      where: { branchId: parseInt(id) }
    });

    const usersCount = await prisma.user.count({
      where: { branchId: parseInt(id) }
    });

    if (booksCount > 0 || subjectsCount > 0 || usersCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete branch as it is being used by books, subjects, or users' 
      });
    }

    await prisma.branch.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch
}; 