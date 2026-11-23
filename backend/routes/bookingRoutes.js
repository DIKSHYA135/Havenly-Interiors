import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import {
  validateBookingInput,
  validateStatusUpdate,
} from '../middleware/validateInput.js';

const router = express.Router();

// Public booking submission
router.post('/', validateBookingInput, createBooking);

// Protected Admin operations
router.get('/', protectAdmin, getBookings);
router.get('/:id', protectAdmin, getBookingById);
router.patch(
  '/:id/status',
  protectAdmin,
  validateStatusUpdate(['Pending', 'Confirmed', 'Completed', 'Cancelled']),
  updateBookingStatus
);
router.delete('/:id', protectAdmin, deleteBooking);

export default router;
