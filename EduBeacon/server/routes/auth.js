const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');
const { auth } = require('../middleware/auth');
const { validate, authSchemas } = require('../middleware/validator');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per `window` (here, per 15 minutes)
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const router = express.Router();

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/admin-register
// @desc    Register admin and create organization
// @access  Public
router.post('/admin-register', authLimiter, validate(authSchemas.adminRegister), async (req, res) => {
  if (process.env.DISABLE_PUBLIC_ADMIN_REGISTER === 'true') {
    return res.status(403).json({ message: 'Admin registration is disabled on this server.' });
  }

  try {
    const { name, email, password, organizationName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create admin user
    const admin = new User({
      name,
      email,
      password,
      role: 'admin'
    });

    await admin.save();

    // Create organization
    const organization = new Organization({
      name: organizationName,
      adminId: admin._id
    });

    await organization.save();

    // Update admin with organization ID
    admin.organizationId = organization._id;
    await admin.save();

    const token = generateToken(admin._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      token, // Kept for backwards compatibility if needed during transition
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        organizationId: organization._id
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, validate(authSchemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      token, // Kept for backwards compatibility
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId
      }
    });
  } catch (error) {
    console.error('[Auth] Login error:', error.message);
    res.status(500).json({
      message:
        process.env.NODE_ENV === 'production'
          ? 'Server error'
          : error.message || 'Server error',
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, message: 'User logged out' });
});

module.exports = router;
