const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create permissions
  const permissions = [
    { name: 'Add Users', permissionCode: 'add-users' },
    { name: 'Edit Users', permissionCode: 'edit-users' },
    { name: 'Delete Users', permissionCode: 'delete-users' },
    { name: 'View Users', permissionCode: 'view-users' },
    { name: 'Manage Settings', permissionCode: 'manage-settings' },
    { name: 'Manage URLs', permissionCode: 'manage-urls' },
    { name: 'Add Books', permissionCode: 'add-books' },
    { name: 'Edit Books', permissionCode: 'edit-books' },
    { name: 'Delete Books', permissionCode: 'delete-books' },
    { name: 'Add Subjects', permissionCode: 'add-subjects' },
    { name: 'Edit Subjects', permissionCode: 'edit-subjects' },
    { name: 'Delete Subjects', permissionCode: 'delete-subjects' },
    { name: 'Add Chapters', permissionCode: 'add-chapters' },
    { name: 'Edit Chapters', permissionCode: 'edit-chapters' },
    { name: 'Delete Chapters', permissionCode: 'delete-chapters' },
    { name: 'Manage QR Codes', permissionCode: 'manage-qrcodes' },
    { name: 'Manage Academic Years', permissionCode: 'manage-academic-years' },
    { name: 'Manage Branches', permissionCode: 'manage-branches' }
  ];

  // Create permissions
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { permissionCode: permission.permissionCode },
      update: {},
      create: permission
    });
  }

  // Create admin role with all permissions
  const adminRole = await prisma.userRole.upsert({
    where: { role: 'admin' },
    update: {},
    create: {
      role: 'admin',
      name: 'Administrator',
      permissions: {
        connect: permissions.map(p => ({ permissionCode: p.permissionCode }))
      }
    }
  });

  // Create user role with limited permissions
  const userRole = await prisma.userRole.upsert({
    where: { role: 'user' },
    update: {},
    create: {
      role: 'user',
      name: 'Regular User',
      permissions: {
        connect: permissions
          .filter(p => ['add-books', 'edit-books', 'delete-books', 
                       'add-subjects', 'edit-subjects', 'delete-subjects',
                       'add-chapters', 'edit-chapters', 'delete-chapters',
                       'manage-qrcodes'].includes(p.permissionCode))
          .map(p => ({ permissionCode: p.permissionCode }))
      }
    }
  });

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { phone: '1234567890' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '1234567890',
      password: hashedPassword,
      activeStatus: true,
      role: {
        connect: { roleId: adminRole.roleId }
      }
    }
  });

  // Create default academic year
  await prisma.academicYear.upsert({
    where: {  code:'1_year' },
    update: {},
    create: {
      label: '1st year',
      code:'1_year'
    }
  });
  // Create default academic year
  await prisma.academicYear.upsert({
    where: {  code:'2_year' },
    update: {},
    create: {
      label: '2nd year',
      code:'2_year'
    }
  });

  // Create default branch
  await prisma.branch.upsert({
    where: { name: 'MPC' },
    update: {},
    create: {
      name: 'MPC',
      location: 'Main Campus',
      years:{
        connect: [
          { code: '1_year' },  
          { code: '2_year' },  
        ]
      }
    }
  });


  await prisma.branch.upsert({
    where: { name: 'BIPC' },
    update: {},
    create: {
      name: 'BIPC',
      location: 'Main Campus',
      years:{
        connect: [
          { code: '1_year' },  
          { code: '2_year' },  
        ]
      }
    }
  });


  await prisma.branch.upsert({
    where: { name: 'MEC' },
    update: {},
    create: {
      name: 'MEC',
      location: 'Main Campus',
      years:{
        connect: [
          { code: '1_year' },  
          { code: '2_year' },  
        ]
      }
    }
  });
  await prisma.branch.upsert({
    where: { name: 'CEC' },
    update: {},
    create: {
      name: 'CEC',
      location: 'Main Campus',
      years:{
        connect: [
          { code: '1_year' },  
          { code: '2_year' },  
        ]
      }
    }
  });

  console.log('Database seeded successfully!');
  console.log('Default admin credentials:');
  console.log('Email: admin@example.com');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 