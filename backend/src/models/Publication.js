const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PublicationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    authors: {
      type: String,
      default: ''
    },
    publication: {
      type: String,
      default: ''
    },
    journal: {
      type: String,
      default: ''
    },
    conference: {
      type: String,
      default: ''
    },
    publisher: {
      type: String,
      default: ''
    },
    year: {
      type: Number
    },
    citations: {
      type: Number,
      default: 0
    },
    citationId: {
      type: String,
      default: '',
      index: true
    },
    paperURL: {
      type: String,
      default: ''
    },
    pdfURL: {
      type: String,
      default: ''
    },
    doi: {
      type: String,
      default: '',
      trim: true
    },
    volume: {
      type: String,
      default: ''
    },
    issue: {
      type: String,
      default: ''
    },
    pages: {
      type: String,
      default: ''
    },
    abstract: {
      type: String,
      default: ''
    },
    keywords: [
      {
        type: String,
        trim: true
      }
    ],
    publicationType: {
      type: String,
      default: 'Article'
    },
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    readingTime: {
      type: Number,
      default: 5
    },
    researchScore: {
      type: Number,
      default: 20
    },
    aiAnalysis: {
      summary: { type: String, default: '' },
      researchGap: { type: String, default: '' },
      futureWork: { type: String, default: '' },
      methodology: { type: String, default: '' },
      keyFindings: { type: String, default: '' },
      noveltyScore: { type: Number, default: 5 },
      difficultyLevel: { type: String, default: 'Intermediate' }
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

PublicationSchema.index({ userId: 1 });
PublicationSchema.index({ citationId: 1 });
PublicationSchema.index({ isDeleted: 1 });

const Publication = mongoose.model('Publication', PublicationSchema);

module.exports = Publication;
