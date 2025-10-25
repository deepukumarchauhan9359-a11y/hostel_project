import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ensureDatabaseConnectedWithRetry } from '../config/db.js';
import { JWT_SECRET } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from '../errors/AppError.js';
import { validateSignup, validateLogin } from '../validators/auth.validator.js';
import { asyncHandler } from '../errors/asyncHandler.js';

function signToken(user) {
  const payload = { sub: user.id, role: user.role };
  const secret = JWT_SECRET;
  const expiresIn = '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

export const signupController = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) throw new AppError(503, 'Database not connected. Try again shortly.');
  const errMsg = validateSignup(req.body);
  if (errMsg) throw new AppError(400, errMsg);
  const { name, email, password, role, hostelBlock, room } = req.body;
  
  // Prevent admin signup through regular signup
  if (role === 'Admin') {
    throw new AppError(403, 'Admin accounts can only be created through the admin signup process');
  }
  
  const exists = await User.findOne({ email });
  if (exists) throw new AppError(409, 'Email already registered');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ 
    name, 
    email, 
    passwordHash, 
    role, 
    hostelBlock, 
    room,
    isVerified: false // New users need admin verification
  });
  
  // Don't automatically log in unverified users
  return res.status(201).json({ 
    message: 'Account created successfully. Please wait for admin verification before logging in.',
    user: { id: user.id, name: user.name, email: user.email, role: user.role, hostelBlock: user.hostelBlock, room: user.room, isVerified: false }
  });
});

export const adminSignupController = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) throw new AppError(503, 'Database not connected. Try again shortly.');
  
  const { name, email, password, adminCode } = req.body;
  
  // Validate required fields
  if (!name || !email || !password || !adminCode) {
    throw new AppError(400, 'All fields are required');
  }
  
  // Validate admin code
  if (adminCode !== 'ADMIN2024') {
    throw new AppError(403, 'Invalid admin authorization code');
  }
  
  // Check if email already exists
  const exists = await User.findOne({ email });
  if (exists) throw new AppError(409, 'Email already registered');
  
  // Check if there are any existing admins (for additional security)
  const existingAdmins = await User.countDocuments({ role: 'Admin' });
  if (existingAdmins === 0) {
    // First admin can be created without additional verification
    console.log('Creating first admin account');
  } else {
    // For additional admins, require existing admin verification
    // This could be enhanced with a more sophisticated approval system
    console.log('Creating additional admin account');
  }
  
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ 
    name, 
    email, 
    passwordHash, 
    role: 'Admin',
    isVerified: true // Admin accounts are verified by default
  });
  
  const token = signToken(user);
  return res.status(201).json({ 
    token, 
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      isVerified: user.isVerified
    } 
  });
});

export const loginController = asyncHandler(async (req, res) => {
  // Check database connection first
  if (mongoose.connection.readyState !== 1) {
    throw new AppError(503, 'Database not connected. Please try again shortly.');
  }
  
  const errMsg = validateLogin(req.body);
  if (errMsg) throw new AppError(400, errMsg);
  
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError(400, 'Email and password are required');
  }
  
  const user = await User.findOne({ email });
  if (!user) throw new AppError(401, 'Invalid credentials');
  
  const ok = await user.verifyPassword(password);
  if (!ok) throw new AppError(401, 'Invalid credentials');
  
  // Check if user is verified (except for Admin users who are auto-verified)
  if (!user.isVerified && user.role !== 'Admin') {
    throw new AppError(403, 'Your account is pending verification. Please contact the administrator.');
  }
  
  const token = signToken(user);
  return res.json({ 
    token, 
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      hostelBlock: user.hostelBlock, 
      room: user.room 
    } 
  });
});

export async function meController(req, res) {
  const user = await User.findById(req.user.id).select('-passwordHash');
  return res.json({ user });
}


