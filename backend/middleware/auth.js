const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    if (!user || !user.activeStatus) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

const checkPermission = (permissionCode) => {
  return async (req, res, next) => {
    try {
      const hasPermission = req.user?.role?.permissions.some(
        permission => permission.permissionCode === permissionCode
      );

      if (!hasPermission) {
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      }

      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error checking permissions.' });
    }
  };
};

module.exports = { auth, checkPermission }; 
