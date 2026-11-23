import Inquiry from '../models/Inquiry.js';
import { getDBStatus } from '../config/db.js';

// @desc    Create new contact inquiry
// @route   POST /api/contact
// @access  Public
export const createInquiry = async (req, res, next) => {
  try {
    const { isConnected } = getDBStatus();

    if (!isConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database connection is not available. Please verify your MONGODB_URI configuration in backend/.env.',
        error: 'Database unavailable',
      });
    }

    const { name, email, phone, atelier, subject, message } = req.body;

    // Prevent duplicate submission within 60 seconds
    const sixtySecsAgo = new Date(Date.now() - 60 * 1000);

    const recentDuplicate = await Inquiry.findOne({
      email,
      message,
      createdAt: { $gte: sixtySecsAgo },
    });

    if (recentDuplicate) {
      return res.status(429).json({
        success: false,
        message: 'An identical inquiry was just received. Please allow our concierge a moment to respond.',
      });
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      atelier: atelier || 'Kathmandu (Flagship Atelier)',
      subject: subject || 'Residential Architectural Inquiry',
      message,
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been successfully dispatched and saved to our database.',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact inquiries
// @route   GET /api/contact
// @access  Private (Admin)
export const getInquiries = async (req, res, next) => {
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
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single inquiry by ID
// @route   GET /api/contact/:id
// @access  Private (Admin)
export const getInquiryById = async (req, res, next) => {
  try {
    const { isConnected } = getDBStatus();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected.',
      });
    }

    const { id } = req.params;
    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry record not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status
// @route   PATCH /api/contact/:id/status
// @access  Private (Admin)
export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { isConnected } = getDBStatus();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected.',
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Inquiry status updated to ${status}.`,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
export const deleteInquiry = async (req, res, next) => {
  try {
    const { isConnected } = getDBStatus();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected.',
      });
    }

    const { id } = req.params;
    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry record deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
