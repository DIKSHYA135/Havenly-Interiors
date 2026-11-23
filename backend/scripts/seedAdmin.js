import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedAdmin = async () => {
  const uri = process.env.MONGODB_URI?.trim();

  const email = (process.env.ADMIN_EMAIL || 'admin@havenlyinteriors.com').trim().toLowerCase();
  const username = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'HavenlyLuxe2026!';
  const fullName = process.env.ADMIN_NAME || 'Principal Architect';

  console.log('\n============================================================');
  console.log('🏛️  Havenly Interiors - Secure Admin Provisioning Tool');
  console.log('============================================================\n');

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.warn('⚠️  MONGODB_URI is not set in backend/.env.');
    console.log('   The backend server includes a built-in default administrator');
    console.log(`   Username: ${username}`);
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n   Once you add your MongoDB Atlas URI, re-run this script to persist:');
    console.log('   npm run seed:admin\n');
    process.exit(0);
  }

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB Atlas.\n');

    // Check if admin exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }],
    });

    if (existingAdmin) {
      console.log(`ℹ️  Admin account already exists for (${existingAdmin.email} / ${existingAdmin.username}).`);
      console.log('   Updating password and credentials...');
      existingAdmin.password = password;
      existingAdmin.fullName = fullName;
      await existingAdmin.save();
      console.log('✅ Admin credentials updated successfully!\n');
    } else {
      const newAdmin = new Admin({
        username,
        email,
        password,
        fullName,
        role: 'superadmin',
      });
      await newAdmin.save();
      console.log('🎉 Primary Administrator created successfully!\n');
    }

    console.log('------------------------------------------------------------');
    console.log('  Admin Portal Login Credentials:');
    console.log(`  Username: ${username}`);
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log('------------------------------------------------------------\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error provisioning admin account:', error.message);
    process.exit(1);
  }
};

seedAdmin();
