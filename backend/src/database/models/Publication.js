import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  fullName: {
    type: String,
    required: [true, 'Author full name is required'],
    trim: true,
  },
  institution: {
    type: String,
    trim: true,
    default: '',
  },
  order: {
    type: Number,
    required: [true, 'Author order is required'],
    min: [1, 'Author order must be at least 1'],
  },
});

const publicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Publication title is required'],
      trim: true,
    },
    abstract: {
      type: String,
      trim: true,
      default: '',
    },
    authors: {
      type: [authorSchema],
      validate: [
        (val) => val.length > 0,
        'A publication must have at least one author',
      ],
    },
    doi: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true,
      match: [
        /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i,
        'Please provide a valid DOI string',
      ],
    },
    publicationType: {
      type: String,
      enum: ['journal', 'conference', 'book', 'preprint', 'patent', 'other'],
      default: 'journal',
    },
    journal: {
      type: String,
      trim: true,
      default: '',
    },
    conference: {
      type: String,
      trim: true,
      default: '',
    },
    publisher: {
      type: String,
      trim: true,
      default: '',
    },
    publicationDate: {
      type: Date,
      required: [true, 'Publication date is required'],
    },
    volume: {
      type: String,
      trim: true,
      default: '',
    },
    issue: {
      type: String,
      trim: true,
      default: '',
    },
    pages: {
      type: String,
      trim: true,
      default: '',
    },
    url: {
      type: String,
      trim: true,
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        'Please provide a valid URL',
      ],
      default: '',
    },
    pdfUrl: {
      type: String,
      trim: true,
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        'Please provide a valid PDF URL',
      ],
      default: '',
    },
    keywords: {
      type: [String],
      default: [],
    },
    researchAreas: {
      type: [String],
      default: [],
    },
    stats: {
      citations: { type: Number, default: 0, min: 0 },
      views: { type: Number, default: 0, min: 0 },
      downloads: { type: Number, default: 0, min: 0 },
    },
    // AI Embeddings Fields
    embedding: {
      type: [Number],
      default: undefined,
    },
    embeddingModel: {
      type: String,
      trim: true,
    },
    aiMetadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    processedAt: Date,
    vectorVersion: {
      type: String,
      trim: true,
    },
    // Audit & Soft Delete Support
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by user is required'],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for Search & Filter Performance
publicationSchema.index({ keywords: 1 });
publicationSchema.index({ researchAreas: 1 });
publicationSchema.index({ publicationType: 1 });
publicationSchema.index({ publicationDate: -1 });
publicationSchema.index({ 'stats.citations': -1 });
publicationSchema.index({ isDeleted: 1 });

// Text Search Index for Global Unified Search
publicationSchema.index(
  {
    title: 'text',
    abstract: 'text',
    keywords: 'text',
  },
  {
    name: 'publication_text_search',
    weights: {
      title: 10,
      keywords: 5,
      abstract: 1,
    },
  }
);

const Publication = mongoose.model('Publication', publicationSchema);

export default Publication;
