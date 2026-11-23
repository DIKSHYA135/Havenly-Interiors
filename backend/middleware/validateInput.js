// Input validation helpers and middleware for Havenly Interiors

export const validateContactInput = (req, res, next) => {
  const { name, email, phone, message } = req.body;
  const errors = {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Full name is required (minimum 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.email = 'A valid email address is required.';
  }

  if (phone && typeof phone === 'string' && phone.trim().length > 0) {
    const cleanPhone = phone.replace(/[\s-]/g, '');
    // If Nepal number
    if (phone.includes('+977') || (!phone.startsWith('+') && cleanPhone.length === 10)) {
      if (!/^(?:\+977)?(?:9[78]\d{8}|9[78]X{8})$/i.test(cleanPhone)) {
        errors.phone = 'Please provide a valid 10-digit Nepal mobile number (e.g. 98XXXXXXXX).';
      }
    }
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.message = 'Please provide a message with at least 10 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the highlighted fields.',
      errors,
    });
  }

  // Clean strings
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.phone = phone ? phone.trim() : '';
  req.body.message = message.trim();

  next();
};

export const validateBookingInput = (req, res, next) => {
  const { fullName, email, phone, preferredDate } = req.body;
  const errors = {};

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 3) {
    errors.fullName = 'Please provide your full legal name (minimum 3 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.email = 'A valid email address is required.';
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    errors.phone = 'A valid phone number is required.';
  } else {
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (phone.includes('+977') || (!phone.startsWith('+') && cleanPhone.length === 10)) {
      if (!/^(?:\+977)?(?:9[78]\d{8}|9[78]X{8})$/i.test(cleanPhone)) {
        errors.phone = 'Please provide a valid 10-digit Nepal mobile number (e.g. 98XXXXXXXX).';
      }
    }
  }

  if (!preferredDate || typeof preferredDate !== 'string' || preferredDate.trim().length === 0) {
    errors.preferredDate = 'Please select a preferred consultation date.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please complete all required booking details.',
      errors,
    });
  }

  req.body.fullName = fullName.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.phone = phone.trim();
  req.body.preferredDate = preferredDate.trim();

  next();
};

export const validateAdminLogin = (req, res, next) => {
  const { identifier, username, email, password } = req.body;
  const userIdent = (identifier || username || email || '').trim();

  if (!userIdent) {
    return res.status(400).json({
      success: false,
      message: 'Admin username or email is required.',
    });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.',
    });
  }

  req.body.identifier = userIdent;
  next();
};

export const validateStatusUpdate = (allowedStatuses) => (req, res, next) => {
  const { status } = req.body;
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
    });
  }
  next();
};
