const mongoose = require('mongoose');
const logger = require('../../common/logger/winston');

// Import all models to register their schemas
require('../../models/User');
require('../../models/Profile');
require('../../models/Settings');
require('../../models/Notification');
require('../../models/Session');
require('../../models/ActivityLog');
require('../../models/RefreshToken');
require('../../models/EmailOtp');
require('../../models/SystemConfiguration');
require('../../models/ApplicationLog');

const syncDatabaseIndexes = async () => {
  logger.info('Auditing and syncing database indexes...');
  try {
    const models = mongoose.modelNames();
    for (const modelName of models) {
      const Model = mongoose.model(modelName);
      logger.info(`Syncing indexes for model: ${modelName}`);
      await Model.syncIndexes();
    }
    logger.info('Database indexes synced successfully.');
  } catch (error) {
    logger.error('Error syncing database indexes:', error);
  }
};

module.exports = {
  syncDatabaseIndexes
};
