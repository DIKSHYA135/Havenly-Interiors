import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
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
      trim: true,
      default: '',
    },
    atelier: {
      type: String,
      trim: true,
      default: 'Kathmandu (Flagship Atelier)',
    },
    subject: {
      type: String,
      trim: true,
      default: 'Residential Architectural Inquiry',
    },
    message: {
      type: String,
      required: [true, 'Please provide an inquiry message'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters long'],
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },
    status: {
      type: String,
      enum: ['New', 'In Review', 'Responded', 'Archived'],
      default: 'New',
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick queries
inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ email: 1 });
inquirySchema.index({ status: 1 });

const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);

export default Inquiry;
