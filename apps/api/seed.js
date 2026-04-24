const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chuoi-kinh-doanh';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  await db.collection('users').deleteMany({ email: 'admin@ckd.vn' });
  await db.collection('users').insertOne({
    email: 'admin@ckd.vn',
    password: hashedPassword,
    fullName: 'Admin Hệ thống',
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Create demo tenant branch
  await db.collection('branches').deleteMany({ name: 'Khách sạn Grand Quận 1' });
  const branch = await db.collection('branches').insertOne({
    name: 'Khách sạn Grand Quận 1',
    industry: 'hotel',
    address: '123 Nguyễn Huệ, Q.1, TP.HCM',
    phone: '028-1234-5678',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Create demo manager
  const mgPassword = await bcrypt.hash('Manager@123', 10);
  await db.collection('users').deleteMany({ email: 'manager@ckd.vn' });
  await db.collection('users').insertOne({
    email: 'manager@ckd.vn',
    password: mgPassword,
    fullName: 'Nguyễn Văn Quản Lý',
    role: 'branch_manager',
    branchId: branch.insertedId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Create demo staff
  const stPassword = await bcrypt.hash('Staff@123', 10);
  await db.collection('users').deleteMany({ email: 'staff@ckd.vn' });
  await db.collection('users').insertOne({
    email: 'staff@ckd.vn',
    password: stPassword,
    fullName: 'Trần Thị Nhân Viên',
    role: 'staff',
    branchId: branch.insertedId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('✅ Seed completed!');
  console.log('  Admin:   admin@ckd.vn / Admin@123');
  console.log('  Manager: manager@ckd.vn / Manager@123');
  console.log('  Staff:   staff@ckd.vn / Staff@123');
  await mongoose.disconnect();
}

seed().catch(console.error);
