const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['researcher', 'admin'],
      default: 'researcher'
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended'],
      default: 'active'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    profileImage: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
UserSchema.index({ createdAt: 1 });

const User = mongoose.model('User', UserSchema);

module.exports = User;
