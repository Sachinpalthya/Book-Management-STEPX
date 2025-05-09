const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const createSuperAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/book_management_bhe';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      console.log('Super admin already exists with mobile:', existingSuperAdmin.mobileNumber);
      await mongoose.disconnect();
      return;
    }

    // Create super admin with provided credentials
    const superAdmin = new User({
      name: 'Super Admin',
      mobileNumber: '6281572817',
      password: 'Sachin@1823',
      role: 'super_admin',
      isActive: true
    });

    await superAdmin.save();
    console.log('Super admin created successfully!');
    console.log('Mobile Number:', superAdmin.mobileNumber);
    console.log('Role:', superAdmin.role);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating super admin:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the script
createSuperAdmin();