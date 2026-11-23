import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please provide your full legal name'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please provide your contact telephone number'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      default: 'Kathmandu',
    },
    projectType: {
      type: String,
      trim: true,
      default: 'Multi-Room Residence',
    },
    rooms: {
      type: [String],
      default: ['Living Room'],
    },
    budgetBracket: {
      type: String,
      trim: true,
      default: 'Rs. 3,50,000 - Rs. 7,50,000',
    },
    preferredStyle: {
      type: String,
      trim: true,
      default: 'Warm Minimalist & Travertine',
    },
    consultationMode: {
      type: String,
      trim: true,
      default: 'Virtual Video Consultation',
    },
    preferredDate: {
      type: String,
      required: [true, 'Please select a preferred consultation date'],
      trim: true,
    },
    preferredTime: {
      type: String,
      trim: true,
      default: '10:00 AM - 12:00 PM (Morning NPT)',
    },
    message: {
      type: String,
      trim: true,
      default: '',
      maxlength: [3000, 'Notes cannot exceed 3000 characters'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    internalNotes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
