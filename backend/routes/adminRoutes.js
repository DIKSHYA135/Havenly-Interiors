import express from 'express';
import {
  loginAdmin,
  getAdminProfile,
  getDashboardStats,
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { validateAdminLogin } from '../middleware/validateInput.js';

const router = express.Router();

// Admin Authentication
router.post('/login', validateAdminLogin, loginAdmin);

// Protected Admin info & analytics
router.get('/profile', protectAdmin, getAdminProfile);
router.get('/stats', protectAdmin, getDashboardStats);

export default router;
