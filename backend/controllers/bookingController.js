import Booking from '../models/Booking.js';
import { getDBStatus } from '../config/db.js';

// Helper to generate luxury booking reference
const generateReferenceCode = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `HAV-${randomNum}`;
};

// @desc    Create consultation booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res, next) => {
  try {
    const { isConnected } = getDBStatus();

    if (!isConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database connection is not available. Please verify your MONGODB_URI configuration in backend/.env.',
        error: 'Database unavailable',
      });
    }

    const {
      fullName,
      email,
      phone,
      city,
      projectType,
      rooms,
      budgetBracket,
      preferredStyle,
      consultationMode,
      preferredDate,
      preferredTime,
      message,
      notes,
    } = req.body;

    const finalMessage = message || notes || '';
    const bookingReference = generateReferenceCode();

    const booking = await Booking.create({
      bookingReference,
      fullName,
      email,
      phone,
      city: city || 'Kathmandu',
      projectType: projectType || 'Multi-Room Residence',
      rooms: Array.isArray(rooms) && rooms.length > 0 ? rooms : ['Living Room'],
      budgetBracket: budgetBracket || 'Rs. 3,50,000 - Rs. 7,50,000',
      preferredStyle: preferredStyle || 'Warm Minimalist & Travertine',
      consultationMode: consultationMode || 'Virtual Video Consultation',
      preferredDate,
      preferredTime: preferredTime || '10:00 AM - 12:00 PM (Morning NPT)',
      message: finalMessage,
      status: 'Pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Your architectural consultation appointment has been reserved and recorded in the database.',
      bookingReference: booking.bookingReference,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all consultation bookings
// @route   GET /api/bookings
// @access  Private (Admin)
export const getBookings = async (req, res, next) => {
  try {
    const { isConnected } = getDBStatus();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected.',
      });
    }

    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { bookingReference: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private (Admin)
export const getBookingById = async (req, res, next) => {
  try {
    const { isConnected } = getDBStatus();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected.',
      });
    }

    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking reservation not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private (Admin)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { isConnected } = getDBStatus();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected.',
      });
    }

    const { id } = req.params;
    const { status, internalNotes } = req.body;

    const updateFields = { status };
    if (internalNotes !== undefined) {
      updateFields.internalNotes = internalNotes;
    }

    const booking = await Booking.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking reservation not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Booking #${booking.bookingReference} status changed to ${status}.`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
export const deleteBooking = async (req, res, next) => {
  try {
    const { isConnected } = getDBStatus();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected.',
      });
    }

    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Booking record deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
