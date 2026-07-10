const User = require('../models/User');

async function listUsers() {
  return User.find({}).sort({ createdAt: 1 });
}

module.exports = {
  listUsers
};
