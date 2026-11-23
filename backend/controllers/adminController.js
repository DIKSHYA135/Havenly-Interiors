import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import Inquiry from '../models/Inquiry.js';
import Booking from '../models/Booking.js';
import { getDBStatus } from '../config/db.js';

// Helper to generate JWT
const generateToken = (admin) => {
  const secret = process.env.JWT_SECRET || 'havenly_luxury_secret_jwt_key_2026';
  return jwt.sign(
    {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    },
    secret,
    { expiresIn: '7d' }
  );
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    const { isConnected } = getDBStatus();

    if (!isConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database is currently disconnected. Please verify MONGODB_URI in backend/.env.',
        error: 'Database unavailable',
      });
    }

    const { identifier, password } = req.body;
    const normalizedIdent = identifier.trim().toLowerCase();

    // Find admin by email or username
    const admin = await Admin.findOne({
      $or: [{ email: normalizedIdent }, { username: normalizedIdent }],
    }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your admin username and password.',
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your admin username and password.',
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = generateToken(admin);

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${admin.fullName}.`,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin)
export const getAdminProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      admin: req.admin,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const { isConnected } = getDBStatus();

    if (!isConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database is currently disconnected.',
      });
    }

    const [
      totalInquiries,
      newInquiries,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
    ] = await Promise.all([
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'New' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Confirmed' }),
      Booking.countDocuments({ status: 'Completed' }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalInquiries,
        newInquiries,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
      },
      databaseStatus: getDBStatus(),
    });
  } catch (error) {
    next(error);
  }
};
