const mongoose = require('mongoose');

async function connectDatabase(uri = process.env.MONGODB_URI) {
  if (!uri) {
    throw new Error('MONGODB_URI is required');
  }

  return mongoose.connect(uri);
}

async function disconnectDatabase() {
  return mongoose.disconnect();
}

module.exports = {
  connectDatabase,
  disconnectDatabase
};
