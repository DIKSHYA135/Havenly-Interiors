import express from 'express';
import {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/contactController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import {
  validateContactInput,
  validateStatusUpdate,
} from '../middleware/validateInput.js';

const router = express.Router();

// Public inquiry submission
router.post('/', validateContactInput, createInquiry);

// Protected Admin operations
router.get('/', protectAdmin, getInquiries);
router.get('/:id', protectAdmin, getInquiryById);
router.patch(
  '/:id/status',
  protectAdmin,
  validateStatusUpdate(['New', 'In Review', 'Responded', 'Archived']),
  updateInquiryStatus
);
router.delete('/:id', protectAdmin, deleteInquiry);

export default router;
