import mongoose from 'mongoose';

const researcherProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    institution: {
      type: String,
      trim: true,
      default: '',
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    socialLinks: {
      orcid: { type: String, trim: true, default: '' },
      googleScholar: { type: String, trim: true, default: '' },
      researchGate: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      website: { type: String, trim: true, default: '' },
    },
    stats: {
      views: { type: Number, default: 0 },
      citations: { type: Number, default: 0 },
      reads: { type: Number, default: 0 },
      hIndex: { type: Number, default: 0 },
    },
    publications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publication',
      },
    ],
    coAuthors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for search performance
researcherProfileSchema.index({ institution: 1 });
researcherProfileSchema.index({ skills: 1 });

const ResearcherProfile = mongoose.model('ResearcherProfile', researcherProfileSchema);

export default ResearcherProfile;
