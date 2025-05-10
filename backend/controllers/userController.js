const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: {
          include: {
            permissions: true
          }
        },
        branch: true
      }
    });

    // Remove sensitive information
    const sanitizedUsers = users.map(user => ({
      ...user,
      password: undefined
    }));

    res.json(sanitizedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, roleId, branchId } = req.body;

    // Validate required fields
    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'Name, phone, and password are required' });
    }

    // Check if user with same phone or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          { email: email || '' }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this phone or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        roleId,
        branchId,
        activeStatus: true,
        joiningDate: new Date()
      },
      include: {
        role: {
          include: {
            permissions: true
          }
        },
        branch: true
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password, roleId, branchId, activeStatus } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prepare update data
    const updateData = {
      name,
      email,
      phone,
      roleId,
      branchId,
      activeStatus
    };

    // If password is provided, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        role: {
          include: {
            permissions: true
          }
        },
        branch: true
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,   
  deleteUser
}; 