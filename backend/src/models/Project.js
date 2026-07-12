const mongoose = require('mongoose');
const slugify = require('slugify');
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  // userId is retained for the existing profile/feed modules; owner is the project-module name.
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, trim: true, unique: true, sparse: true, index: true },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  longDescription: { type: String, maxlength: 10000 }, coverImage: String,
  status: { type: String, enum: ['Draft', 'Active', 'In Progress', 'Completed', 'Archived', 'Ongoing', 'Proposed'], default: 'Draft', index: true },
  visibility: { type: String, enum: ['Public', 'Private', 'Collaborators Only'], default: 'Public' },
  researchDomain: { type: String, index: true }, researchAreas: [String], tags: [String], techStack: [String],
  collaborators: [{ type: Schema.Types.Mixed }], institution: String, department: String, principalInvestigator: String,
  budget: { type: Number, min: 0, default: 0 }, fundingSource: String, startDate: Date, endDate: Date,
  progress: { type: Number, min: 0, max: 100, default: 0 }, objectives: [String], deliverables: [String],
  milestones: [{ title: String, dueDate: Date, completed: { type: Boolean, default: false } }], skills: [String],
  attachments: [{ name: String, url: String, type: String }], githubUrl: String,
  githubRepository: { name: String, description: String, url: String, stars: Number, forks: Number, language: String, topics: [String], updatedAt: Date, isPrivate: Boolean, syncedAt: Date },
  paperUrl: String, demoUrl: String, license: String, notes: String, isArchived: { type: Boolean, default: false, index: true }, isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
ProjectSchema.index({ owner: 1, status: 1, createdAt: -1 }); ProjectSchema.index({ userId: 1, status: 1, createdAt: -1 }); ProjectSchema.index({ title: 'text', description: 'text', tags: 'text' });
ProjectSchema.pre('validate', async function (next) { if (!this.owner && this.userId) this.owner = this.userId; if (!this.userId && this.owner) this.userId = this.owner; if (!this.isModified('title') || this.slug) return next(); const base = slugify(this.title, { lower: true, strict: true }) || 'project'; const exists = await this.constructor.exists({ slug: base }); this.slug = exists ? `${base}-${Date.now().toString().slice(-5)}` : base; next(); });
module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
