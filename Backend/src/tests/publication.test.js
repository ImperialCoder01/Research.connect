import Publication from '../models/Publication.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL;

async function runTests() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  const results = { passed: 0, failed: 0 };

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      results.passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name} — ${err.message}`);
      results.failed++;
    }
  }

  await Publication.deleteMany({ title: /^TEST_PUB_/ });
  let createdId;

  await test('Create a publication', async () => {
    const pub = await Publication.create({
      title: 'TEST_PUB_Alpha - Deep Learning Survey',
      abstract: 'A comprehensive survey of deep learning techniques.',
      authors: [{ displayName: 'Harsh Sharma', institution: 'IIT Delhi' }],
      journal: 'IEEE Transactions',
      publicationDate: new Date('2024-03-15'),
      tags: ['deep learning', 'ai', 'neural networks'],
      citationCount: 5,
    });
    createdId = pub._id;
    if (!pub._id) throw new Error('Not created');
  });

  await test('Fetch publication by ID', async () => {
    const pub = await Publication.findById(createdId).lean();
    if (!pub) throw new Error('Not found');
    if (pub.citationCount !== 5) throw new Error('citationCount mismatch');
  });

  await test('Update publication fields', async () => {
    const updated = await Publication.findByIdAndUpdate(
      createdId, { $set: { citationCount: 10, journal: 'Nature' } },
      { new: true, runValidators: true }
    ).lean();
    if (updated.citationCount !== 10) throw new Error('citationCount not updated');
    if (updated.journal !== 'Nature') throw new Error('journal not updated');
  });

  await test('Increment citation count ($inc)', async () => {
    const updated = await Publication.findByIdAndUpdate(
      createdId, { $inc: { citationCount: 1 } }, { new: true }
    ).lean();
    if (updated.citationCount !== 11) throw new Error(`Expected 11, got ${updated.citationCount}`);
  });

  await test('Pagination and sort by citationCount desc', async () => {
    await Publication.create([
      { title: 'TEST_PUB_Beta - NLP Advances', abstract: 'NLP.', authors: [{ displayName: 'Mohd Irshad' }], citationCount: 50, tags: ['nlp'], publicationDate: new Date('2023-05-01') },
      { title: 'TEST_PUB_Gamma - Computer Vision', abstract: 'CV.', authors: [{ displayName: 'Ravi Kumar' }], citationCount: 100, tags: ['computer vision', 'ai'], publicationDate: new Date('2022-01-20') },
    ]);
    const pubs = await Publication.find({ title: /^TEST_PUB_/ }).sort({ citationCount: -1 }).skip(0).limit(2).lean();
    if (pubs.length !== 2) throw new Error(`Expected 2, got ${pubs.length}`);
    if (pubs[0].citationCount < pubs[1].citationCount) throw new Error('Sort order wrong');
  });

  await test('Filter by tag', async () => {
    const pubs = await Publication.find({ tags: { $in: ['ai'] }, title: /^TEST_PUB_/ }).lean();
    if (pubs.length < 1) throw new Error('Tag filter returned nothing');
  });

  await test('Filter by year (2024)', async () => {
    const pubs = await Publication.find({
      publicationDate: { $gte: new Date('2024-01-01'), $lte: new Date('2024-12-31T23:59:59.999Z') },
      title: /^TEST_PUB_/,
    }).lean();
    if (pubs.length !== 1) throw new Error(`Expected 1, got ${pubs.length}`);
  });

  await test('Filter by author name (regex)', async () => {
    const pubs = await Publication.find({ 'authors.displayName': { $regex: 'Harsh', $options: 'i' }, title: /^TEST_PUB_/ }).lean();
    if (pubs.length < 1) throw new Error('Author filter returned nothing');
  });

  await test('Keyword search in title/abstract', async () => {
    const q = 'learning';
    const pubs = await Publication.find({
      $or: [{ title: { $regex: q, $options: 'i' } }, { abstract: { $regex: q, $options: 'i' } }],
      title: /^TEST_PUB_/,
    }).lean();
    if (pubs.length < 1) throw new Error('Keyword search returned nothing');
  });

  await test('Reject duplicate title (unique constraint)', async () => {
    try {
      await Publication.create({ title: 'TEST_PUB_Alpha - Deep Learning Survey', abstract: 'Dup.', authors: [{ displayName: 'X' }] });
      throw new Error('Should have thrown duplicate key error');
    } catch (err) {
      if (!err.code || err.code !== 11000) throw err;
    }
  });

  await test('Delete publication', async () => {
    const deleted = await Publication.findByIdAndDelete(createdId);
    if (!deleted) throw new Error('Delete returned null');
    const check = await Publication.findById(createdId);
    if (check) throw new Error('Still exists after delete');
  });

  await Publication.deleteMany({ title: /^TEST_PUB_/ });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Results: ${results.passed} passed, ${results.failed} failed`);
  if (results.failed > 0) { process.exit(1); }
  else { console.log('🎉 All tests passed!'); }
  await mongoose.disconnect();
}

runTests().catch((err) => { console.error('Fatal:', err.message); process.exit(1); });
