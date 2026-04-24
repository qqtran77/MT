const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chuoi-kinh-doanh';

// ─── Data definitions ────────────────────────────────────────────────────────

const BRANCH_DATA = [
  { name:'Khách sạn Grand Q.1', type:'hotel', address:'123 Nguyễn Huệ, Q.1, TP.HCM', manager:'Trần Văn Minh', phone:'028-1234-5678', status:'active', staffCount:24, monthlyRevenue:285000000, openDate:new Date('2020-03-15'), rooms:45, rating:4.8, isActive:true },
  { name:'Khách sạn Riverside Q.4', type:'hotel', address:'56 Bến Vân Đồn, Q.4, TP.HCM', manager:'Lê Thị Hoa', phone:'028-2345-6789', status:'active', staffCount:18, monthlyRevenue:198000000, openDate:new Date('2021-06-01'), rooms:32, rating:4.6, isActive:true },
  { name:'Cafe CKD Q.3', type:'cafe', address:'88 Võ Văn Tần, Q.3, TP.HCM', manager:'Nguyễn Thị Lan', phone:'028-3456-7890', status:'active', staffCount:8, monthlyRevenue:95000000, openDate:new Date('2019-11-20'), rooms:20, rating:4.7, isActive:true },
  { name:'Cafe CKD Q.7', type:'cafe', address:'200 Nguyễn Thị Thập, Q.7, TP.HCM', manager:'Phạm Văn Đức', phone:'028-4567-8901', status:'active', staffCount:6, monthlyRevenue:72000000, openDate:new Date('2022-01-10'), rooms:15, rating:4.5, isActive:true },
  { name:'Rạp CKD Q.7', type:'cinema', address:'Crescent Mall, Q.7, TP.HCM', manager:'Hoàng Minh Tuấn', phone:'028-5678-9012', status:'active', staffCount:15, monthlyRevenue:165000000, openDate:new Date('2021-09-15'), rooms:7, rating:4.9, isActive:true },
  { name:'Rạp CKD Bình Thạnh', type:'cinema', address:'Vincom Mega Mall, Bình Thạnh, TP.HCM', manager:'Vũ Thị Thu', phone:'028-6789-0123', status:'inactive', staffCount:0, monthlyRevenue:0, openDate:new Date('2023-12-01'), rooms:5, rating:0, isActive:false },
];

const CUSTOMER_DATA = [
  { fullName:'Nguyễn Văn An',  email:'an.nv@gmail.com',    phone:'0901111001', tier:'bronze',   walletBalance:250000,   loyaltyPoints:150,  totalSpent:1500000 },
  { fullName:'Trần Thị Bích',  email:'bich.tt@gmail.com',  phone:'0901111002', tier:'silver',   walletBalance:1200000,  loyaltyPoints:850,  totalSpent:8500000 },
  { fullName:'Lê Hoàng Nam',   email:'nam.lh@gmail.com',   phone:'0901111003', tier:'gold',     walletBalance:3500000,  loyaltyPoints:2400, totalSpent:24000000 },
  { fullName:'Phạm Thị Lan',   email:'lan.pt@gmail.com',   phone:'0901111004', tier:'platinum', walletBalance:8000000,  loyaltyPoints:6800, totalSpent:68000000 },
  { fullName:'Hoàng Văn Minh', email:'minh.hv@gmail.com',  phone:'0901111005', tier:'bronze',   walletBalance:50000,    loyaltyPoints:80,   totalSpent:800000 },
  { fullName:'Vũ Thị Thu',     email:'thu.vt@gmail.com',   phone:'0901111006', tier:'silver',   walletBalance:750000,   loyaltyPoints:620,  totalSpent:6200000 },
  { fullName:'Đặng Văn Long',  email:'long.dv@gmail.com',  phone:'0901111007', tier:'gold',     walletBalance:2100000,  loyaltyPoints:1950, totalSpent:19500000 },
  { fullName:'Bùi Thị Hoa',    email:'hoa.bt@gmail.com',   phone:'0901111008', tier:'bronze',   walletBalance:300000,   loyaltyPoints:210,  totalSpent:2100000 },
  { fullName:'Lý Văn Sơn',     email:'son.lv@gmail.com',   phone:'0901111009', tier:'platinum', walletBalance:12000000, loyaltyPoints:9200, totalSpent:92000000 },
  { fullName:'Ngô Thị Yến',    email:'yen.nt@gmail.com',   phone:'0901111010', tier:'silver',   walletBalance:980000,   loyaltyPoints:780,  totalSpent:7800000 },
];

const INVENTORY_DATA = [
  { name:'Cà phê nguyên chất', category:'cafe',    unit:'kg',   quantity:45,  minQuantity:10,  unitPrice:280000, description:'Cà phê Arabica nguyên chất, rang xay tươi' },
  { name:'Sữa tươi',           category:'cafe',    unit:'hộp',  quantity:120, minQuantity:30,  unitPrice:28000,  description:'Sữa tươi tiệt trùng 1 lít' },
  { name:'Đường',              category:'cafe',    unit:'kg',   quantity:80,  minQuantity:20,  unitPrice:22000,  description:'Đường trắng tinh luyện' },
  { name:'Khăn trải giường',   category:'hotel',   unit:'cái',  quantity:200, minQuantity:50,  unitPrice:85000,  description:'Khăn trải giường cotton 100%, size 1m6' },
  { name:'Dầu gội đầu',        category:'hotel',   unit:'chai', quantity:350, minQuantity:100, unitPrice:45000,  description:'Dầu gội đầu khách sạn 250ml' },
  { name:'Nước uống đóng chai', category:'hotel',  unit:'chai', quantity:500, minQuantity:200, unitPrice:8000,   description:'Nước tinh khiết đóng chai 500ml' },
  { name:'Bỏng ngô',           category:'cinema',  unit:'túi',  quantity:85,  minQuantity:30,  unitPrice:35000,  description:'Bỏng ngô bơ muối đóng gói sẵn' },
  { name:'Nước ngọt',          category:'cinema',  unit:'lon',  quantity:240, minQuantity:80,  unitPrice:15000,  description:'Nước ngọt có ga các loại 330ml' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function skipIfExists(db, collectionName, label) {
  const count = await db.collection(collectionName).countDocuments();
  if (count > 0) {
    console.log(`  ⚠️  ${label}: already has ${count} records — skipping`);
    return true;
  }
  return false;
}

// ─── Seed ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  console.log('✅ Connected to', MONGODB_URI, '\n');

  let seededUsers = 0;
  let seededCustomers = 0;
  let seededInventory = 0;

  // ── Users ────────────────────────────────────────────────────────────────
  console.log('👤 Seeding users...');

  const userDefs = [
    { email:'admin@ckd.vn',      password:'Admin@123',      fullName:'Admin Hệ thống',        role:'admin',         branchRef:null },
    { email:'manager@ckd.vn',    password:'Manager@123',    fullName:'Nguyễn Văn Quản Lý',    role:'branch_manager', branchRef:'Khách sạn Grand Q.1' },
    { email:'staff@ckd.vn',      password:'Staff@123',      fullName:'Trần Thị Nhân Viên',    role:'staff',         branchRef:'Khách sạn Grand Q.1' },
    { email:'staff2@ckd.vn',     password:'Staff@123',      fullName:'Nguyễn Thị Mai',        role:'staff',         branchRef:'Cafe CKD Q.3' },
    { email:'accountant@ckd.vn', password:'Accountant@123', fullName:'Lê Văn Kế',             role:'accountant',    branchRef:null },
  ];

  // ── Branches (seed before users so we can attach branchId) ───────────────
  console.log('🏢 Seeding branches...');
  let branchMap = {}; // name -> ObjectId
  const branchSkipped = await skipIfExists(db, 'branches', 'branches');

  if (!branchSkipped) {
    const now = new Date();
    const toInsert = BRANCH_DATA.map(b => ({ ...b, createdAt: now, updatedAt: now }));
    const result = await db.collection('branches').insertMany(toInsert);
    // Build name->_id map
    toInsert.forEach((b, i) => { branchMap[b.name] = result.insertedIds[i]; });
    console.log(`  ✅ Inserted ${toInsert.length} branches`);
  } else {
    // Still build the map from existing data
    const existing = await db.collection('branches').find({}).toArray();
    existing.forEach(b => { branchMap[b.name] = b._id; });
  }

  // ── Users (skip entire collection or insert missing emails) ───────────────
  for (const def of userDefs) {
    const exists = await db.collection('users').findOne({ email: def.email });
    if (exists) {
      console.log(`  ⚠️  User ${def.email} already exists — skipping`);
      continue;
    }
    const hashed = await bcrypt.hash(def.password, 10);
    const doc = {
      email: def.email,
      password: hashed,
      fullName: def.fullName,
      role: def.role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (def.branchRef && branchMap[def.branchRef]) {
      doc.branchId = branchMap[def.branchRef];
    }
    await db.collection('users').insertOne(doc);
    console.log(`  ✅ Created user: ${def.email}`);
    seededUsers++;
  }

  // ── Customers ─────────────────────────────────────────────────────────────
  console.log('\n👥 Seeding customers...');
  const customerSkipped = await skipIfExists(db, 'customers', 'customers');
  if (!customerSkipped) {
    const now = new Date();
    const toInsert = CUSTOMER_DATA.map(c => ({ ...c, isActive: true, createdAt: now, updatedAt: now }));
    await db.collection('customers').insertMany(toInsert);
    seededCustomers = toInsert.length;
    console.log(`  ✅ Inserted ${seededCustomers} customers`);
  }

  // ── Inventory ─────────────────────────────────────────────────────────────
  console.log('\n📦 Seeding inventory...');
  const inventorySkipped = await skipIfExists(db, 'inventory', 'inventory');
  if (!inventorySkipped) {
    const now = new Date();
    const toInsert = INVENTORY_DATA.map(item => ({ ...item, createdAt: now, updatedAt: now }));
    await db.collection('inventory').insertMany(toInsert);
    seededInventory = toInsert.length;
    console.log(`  ✅ Inserted ${seededInventory} inventory items`);
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Seeded ${seededUsers} users, ${seededCustomers} customers, ${seededInventory} inventory items`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📋 Login credentials:');
  console.log('  Admin:       admin@ckd.vn       / Admin@123');
  console.log('  Manager:     manager@ckd.vn     / Manager@123');
  console.log('  Staff:       staff@ckd.vn       / Staff@123');
  console.log('  Staff 2:     staff2@ckd.vn      / Staff@123');
  console.log('  Accountant:  accountant@ckd.vn  / Accountant@123');

  await mongoose.disconnect();
  console.log('\n🔌 Disconnected. Done!');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
