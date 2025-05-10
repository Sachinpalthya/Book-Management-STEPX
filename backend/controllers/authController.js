const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const { permission } = require('process');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.activeStatus) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    user.permissions = user.role?.permissions?.map((a)=>a.permissionCode);

    user.role.permissions = undefined;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions:user.permissions,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Private (Admin only)
const register = async (req, res) => {
  try {
    const { name, email, phone, password, roleId } = req.body;

    const userExists = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        activeStatus: true,
        roleId,
        createdById: req.user.id
      },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a simple 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real application, you would:
    // 1. Store the OTP in the database with an expiration time
    // 2. Send the OTP via email/SMS
    // For this demo, we'll just return it
    res.json({ 
      message: 'OTP sent successfully',
      otp // Remove this in production
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // In a real application, you would:
    // 1. Verify the OTP from the database
    // 2. Check if it's expired
    // For this demo, we'll just proceed

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword
}; 
