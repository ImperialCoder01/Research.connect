const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    browser: {
      type: String,
      default: 'Unknown'
    },
    device: {
      type: String,
      default: 'Unknown'
    },
    ipAddress: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: 'Unknown'
    },
    loginTime: {
      type: Date,
      default: Date.now
    },
    logoutTime: {
      type: Date
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'revoked'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

SessionSchema.index({ userId: 1, status: 1 });

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;
