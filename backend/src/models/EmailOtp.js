const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailOtpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    otp: {
      type: String,
      required: true
    },
    purpose: {
      type: String,
      enum: ['email_verification', 'password_reset'],
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

EmailOtpSchema.index({ email: 1, purpose: 1 });
EmailOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete on expiry

const EmailOtp = mongoose.model('EmailOtp', EmailOtpSchema);

module.exports = EmailOtp;
