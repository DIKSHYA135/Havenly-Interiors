import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { getDBStatus } from '../config/db.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please authenticate with a valid admin token.',
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'havenly_luxury_secret_jwt_key_2026';
    const decoded = jwt.verify(token, jwtSecret);

    const { isConnected } = getDBStatus();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database is disconnected. Unable to verify admin session.',
      });
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found or has been revoked.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid or expired session token.',
      error: error.message,
    });
  }
};
