/**
 * Havenly Interiors — Full-Stack Verification & Automated Test Suite
 * Tests actual MongoDB persistence via Mongoose, validation, authentication, and CRUD endpoints.
 */
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import app from '../server.js';
import { connectDB, waitForDB } from '../config/db.js';
import { simulateRequest } from './mockTester.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let adminToken = '';
let createdInquiryId = '';
let createdBookingId = '';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${testName}`);
    if (details) console.error(`     Details: ${details}`);
  }
}

async function runTests() {
  console.log('\n============================================================');
  console.log('🧪 Havenly Interiors — Full-Stack Database Verification Suite');
  console.log('============================================================\n');

  // Ensure Mongoose is fully connected before running tests
  const dbReady = await waitForDB(8000);
  if (!dbReady) {
    console.error('❌ Could not connect to database within timeout. Aborting test suite.');
    process.exit(1);
  }

  try {
    const testAdminUsername = (
      process.env.ADMIN_USERNAME || 'admin'
    ).trim().toLowerCase();

    const testAdminEmail = (
      process.env.ADMIN_EMAIL || 'test@havenlyinteriors.com'
    ).trim().toLowerCase();

    const testAdminPassword =
      process.env.ADMIN_PASSWORD || 'HavenlyLuxe2026!';

    let testAdmin = await Admin.findOne({
      $or: [
        { username: testAdminUsername },
        { email: testAdminEmail },
      ],
    });

    if (!testAdmin) {
      testAdmin = new Admin({
        username: testAdminUsername,
        email: testAdminEmail,
        password: testAdminPassword,
        fullName: 'CI Test Admin',
        role: 'superadmin',
      });
    } else {
      testAdmin.password = testAdminPassword;
    }

    await testAdmin.save();

    console.log('✅ Test admin account is ready.');

    // -------------------------------------------------------------------------
    // 1. Root & Health Check Endpoints
    // -------------------------------------------------------------------------
    console.log('--- TEST GROUP 1: Server & Database Health ---');
    {
      const res = await simulateRequest(app, { method: 'GET', url: '/api/health' });
      assert(res.status === 200, 'GET /api/health returns 200 OK');
      assert(res.body.success === true, 'Health check reports success: true');
      assert(res.body.database?.connected === true, 'Health check reports live MongoDB connection: true');
      assert(res.body.database?.host !== null, `Database host is active (${res.body.database?.host})`);
    }

    {
      const res = await simulateRequest(app, { method: 'GET', url: '/' });
      assert(res.status === 200, 'GET / returns 200 OK');
      assert(res.body.databaseConnected === true, 'Root endpoint confirms database is connected');
      assert(res.body.localization?.currency === 'NPR (Rs.)', 'Localization currency is NPR (Rs.)');
      assert(res.body.localization?.phoneCode === '+977', 'Localization phone code is +977');
    }

    // -------------------------------------------------------------------------
    // 2. Contact Inquiries Validation & MongoDB Persistence
    // -------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 2: Contact Inquiries ---');
    {
      // Missing required fields
      const res = await simulateRequest(app, {
        method: 'POST',
        url: '/api/contact',
        body: { name: '', email: 'invalid-email', message: 'short' },
      });
      assert(res.status === 400, 'POST /api/contact rejects invalid data with 400 Bad Request');
      assert(res.body.success === false, 'Rejection reports success: false');
      assert(res.body.errors?.name !== undefined, 'Validation flags empty name');
      assert(res.body.errors?.email !== undefined, 'Validation flags invalid email');
      assert(res.body.errors?.message !== undefined, 'Validation flags message < 10 characters');
    }

    {
      // Valid submission saved to MongoDB
      const res = await simulateRequest(app, {
        method: 'POST',
        url: '/api/contact',
        body: {
          name: 'Aarav Sharma',
          email: 'aarav.sharma@example.com',
          phone: '+977 9841234567',
          atelier: 'Kathmandu (Flagship Atelier)',
          subject: 'Residential Architectural Inquiry',
          message: 'Interested in bespoke modern interior styling for a luxury residence in Jhamsikhel.',
        },
      });
      assert(res.status === 201, 'POST /api/contact accepts valid inquiry with 201 Created');
      assert(res.body.success === true, 'Response confirms success: true');
      assert(res.body.data?._id !== undefined, 'Inquiry receives persistent MongoDB _id');
      createdInquiryId = res.body.data?._id;
    }

    {
      // Duplicate prevention test
      const res = await simulateRequest(app, {
        method: 'POST',
        url: '/api/contact',
        body: {
          name: 'Aarav Sharma',
          email: 'aarav.sharma@example.com',
          phone: '+977 9841234567',
          atelier: 'Kathmandu (Flagship Atelier)',
          subject: 'Residential Architectural Inquiry',
          message: 'Interested in bespoke modern interior styling for a luxury residence in Jhamsikhel.',
        },
      });
      assert(res.status === 429, 'POST /api/contact blocks duplicate submission within 60s with 429');
    }

    // -------------------------------------------------------------------------
    // 3. Consultation Bookings Validation & MongoDB Persistence
    // -------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 3: Consultation Bookings ---');
    {
      // Invalid booking
      const res = await simulateRequest(app, {
        method: 'POST',
        url: '/api/bookings',
        body: { fullName: 'A', email: 'wrong', phone: '123' },
      });
      assert(res.status === 400, 'POST /api/bookings rejects incomplete input with 400 Bad Request');
      assert(res.body.errors?.fullName !== undefined, 'Flags name < 3 characters');
      assert(res.body.errors?.email !== undefined, 'Flags invalid email');
      assert(res.body.errors?.preferredDate !== undefined, 'Flags missing consultation date');
    }

    {
      // Valid booking with Nepal localization saved to MongoDB
      const res = await simulateRequest(app, {
        method: 'POST',
        url: '/api/bookings',
        body: {
          fullName: 'Pooja Thapa',
          email: 'pooja.thapa@example.com',
          phone: '+977 9851234567',
          city: 'Lalitpur',
          projectType: 'Multi-Room Residence',
          rooms: ['Living Room', 'Master Bedroom'],
          budgetBracket: 'Rs. 7,50,000 - Rs. 15,00,000',
          preferredStyle: 'Warm Minimalist & Travertine',
          consultationMode: 'Virtual Video Consultation',
          preferredDate: '2026-12-01',
          preferredTime: '10:00 AM - 12:00 PM (Morning NPT)',
          message: 'Looking to remodel our 3-bedroom penthouse with natural stone and circadian lighting.',
        },
      });
      assert(res.status === 201, 'POST /api/bookings returns 201 Created');
      assert(res.body.success === true, 'Booking response success is true');
      assert(/^HAV-\d{6}$/.test(res.body.bookingReference), `Generates reference format HAV-XXXXXX (${res.body.bookingReference})`);
      assert(res.body.data?._id !== undefined, 'Booking receives persistent MongoDB _id');
      createdBookingId = res.body.data?._id;
    }

    // -------------------------------------------------------------------------
    // 4. Admin Authentication (JWT & bcrypt in MongoDB)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 4: Admin Authentication ---');
    {
      // Invalid credentials
      const res = await simulateRequest(app, {
        method: 'POST',
        url: '/api/admin/login',
        body: {
          identifier: testAdminUsername,
          password: 'WrongPassword123!',
        },
      });
      assert(res.status === 401, 'Rejects invalid password with 401 Unauthorized');
    }

    {
      // Valid login against MongoDB admin record
      const res = await simulateRequest(app, {
        method: 'POST',
        url: '/api/admin/login',
        body: {
          identifier: testAdminUsername,
          password: testAdminPassword,
        },
      });
      assert(res.status === 200, 'Accepts valid credentials with 200 OK');
      assert(res.body.token !== undefined, 'Returns JWT session token');
      assert(
        res.body.admin?.username === testAdminUsername,
        'Returns admin user profile'
      );
      adminToken = res.body.token;
    }

    // -------------------------------------------------------------------------
    // 5. Protected Admin Endpoints & Workflows
    // -------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 5: Protected Admin Endpoints & Workflows ---');
    {
      // Unauthorized check
      const res = await simulateRequest(app, { method: 'GET', url: '/api/admin/stats' });
      assert(res.status === 401, 'GET /api/admin/stats blocks unauthenticated requests with 401');
    }

    {
      // Authorized stats from MongoDB collections
      const res = await simulateRequest(app, {
        method: 'GET',
        url: '/api/admin/stats',
        headers: { authorization: `Bearer ${adminToken}` },
      });
      assert(res.status === 200, 'GET /api/admin/stats returns 200 with Bearer token');
      assert(res.body.stats?.totalBookings >= 1, 'Stats reflect at least 1 booking in database');
      assert(res.body.stats?.totalInquiries >= 1, 'Stats reflect at least 1 inquiry in database');
    }

    {
      // Fetch bookings list from MongoDB
      const res = await simulateRequest(app, {
        method: 'GET',
        url: '/api/bookings',
        headers: { authorization: `Bearer ${adminToken}` },
      });
      assert(res.status === 200, 'GET /api/bookings returns 200');
      assert(
        Array.isArray(res.body.data),
        'Returns list of bookings array'
      );

      assert(
        Array.isArray(res.body.data) &&
        createdBookingId &&
        res.body.data.some(
          b => b._id?.toString() === createdBookingId.toString()
        ),
        'Contains created booking'
      );
    }

    {
      // Update booking status in MongoDB
      const res = await simulateRequest(app, {
        method: 'PATCH',
        url: `/api/bookings/${createdBookingId}/status`,
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
        body: { status: 'Confirmed', internalNotes: 'Patron confirmed via phone' },
      });
      assert(res.status === 200, 'PATCH /api/bookings/:id/status updates status to Confirmed');
      assert(res.body.data?.status === 'Confirmed', 'Booking status is now Confirmed in MongoDB');
    }

    {
      // Fetch inquiries list from MongoDB
      const res = await simulateRequest(app, {
        method: 'GET',
        url: '/api/contact',
        headers: { authorization: `Bearer ${adminToken}` },
      });
      assert(res.status === 200, 'GET /api/contact returns 200');
      assert(Array.isArray(res.body.data), 'Returns list of inquiries array');
    }

    {
      // Update inquiry status in MongoDB
      const res = await simulateRequest(app, {
        method: 'PATCH',
        url: `/api/contact/${createdInquiryId}/status`,
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
        body: { status: 'In Review' },
      });
      assert(res.status === 200, 'PATCH /api/contact/:id/status updates status to In Review');
      assert(res.body.data?.status === 'In Review', 'Inquiry status is now In Review in MongoDB');
    }

    {
      // Delete inquiry from MongoDB
      const res = await simulateRequest(app, {
        method: 'DELETE',
        url: `/api/contact/${createdInquiryId}`,
        headers: { authorization: `Bearer ${adminToken}` },
      });
      assert(res.status === 200, 'DELETE /api/contact/:id removes inquiry with 200 OK');
    }

    {
      // Delete booking from MongoDB
      const res = await simulateRequest(app, {
        method: 'DELETE',
        url: `/api/bookings/${createdBookingId}`,
        headers: { authorization: `Bearer ${adminToken}` },
      });
      assert(res.status === 200, 'DELETE /api/bookings/:id removes booking with 200 OK');
    }

    // -------------------------------------------------------------------------
    // 6. 404 Handler & Edge Handling
    // -------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 6: 404 & Edge Handling ---');
    {
      const res = await simulateRequest(app, { method: 'GET', url: '/api/nonexistent-route' });
      assert(res.status === 404, 'Unknown endpoint returns 404 Not Found');
    }

  } catch (error) {
    console.error('\n❌ Unhandled exception during test execution:', error);
    failedTests++;
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }

    console.log('\n============================================================');
    console.log(`📊 Test Results: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
    console.log('============================================================\n');

    process.exit(failedTests > 0 ? 1 : 0);
  }
}

runTests();
