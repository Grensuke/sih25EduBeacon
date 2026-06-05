const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { devLog, devWarn } = require('../lib/logger');

const auth = async (req, res, next) => {
  try {
    let token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      devWarn('[Auth] No token provided', { method: req.method, path: req.originalUrl });
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      devWarn('[Auth] Token valid but user not found', { userId: decoded.id });
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    devLog('[Auth] OK', { userId: user._id?.toString?.(), role: user.role, path: req.originalUrl });
    next();
  } catch (error) {
    devWarn('[Auth] Token verification failed', { error: error?.message, path: req.originalUrl });
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    devWarn('[AdminAuth] Denied', { role: req.user.role, path: req.originalUrl });
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  devLog('[AdminAuth] OK', { path: req.originalUrl });
  next();
};

const mentorAuth = (req, res, next) => {
  if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
    devWarn('[MentorAuth] Denied', { role: req.user.role, path: req.originalUrl });
    return res.status(403).json({ message: 'Access denied. Mentor or Admin role required.' });
  }
  devLog('[MentorAuth] OK', { path: req.originalUrl });
  next();
};

const studentAuth = (req, res, next) => {
  if (req.user.role !== 'student' && req.user.role !== 'admin') {
    devWarn('[StudentAuth] Denied', { role: req.user.role, path: req.originalUrl });
    return res.status(403).json({ message: 'Access denied. Student or Admin role required.' });
  }
  devLog('[StudentAuth] OK', { path: req.originalUrl });
  next();
};

module.exports = { auth, adminAuth, mentorAuth, studentAuth };
