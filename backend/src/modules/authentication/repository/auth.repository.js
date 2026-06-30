import User from '../../../database/models/User.js';
import ResearcherProfile from '../../../database/models/ResearcherProfile.js';

class AuthRepository {
  async findByEmail(email) {
    // Select password because we need it for login, select refreshToken for validation
    return User.findOne({ email }).select('+password +refreshToken');
  }

  async findById(id) {
    return User.findById(id).select('+refreshToken');
  }

  async createUser(userData) {
    const user = new User(userData);
    return user.save();
  }

  async createProfile(profileData) {
    const profile = new ResearcherProfile(profileData);
    return profile.save();
  }

  async updateUser(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findByVerificationToken(token) {
    return User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });
  }

  async findByResetToken(token) {
    return User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });
  }
}

export default new AuthRepository();
