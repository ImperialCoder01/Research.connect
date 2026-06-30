import mongoose from 'mongoose';

/**
 * Utility to verify and log all database indexes.
 * Helpful for performance auditing in production.
 */
export const verifyIndexes = async () => {
  try {
    const models = mongoose.modelNames();
    console.log('--- Verifying Database Indexes ---');
    for (const modelName of models) {
      const model = mongoose.model(modelName);
      const indexes = await model.collection.indexes();
      console.log(`Model: ${modelName}`);
      console.dir(indexes, { depth: null });
    }
    console.log('----------------------------------');
  } catch (error) {
    console.error('Error verifying indexes:', error);
  }
};
