const User = require('../models/User');

async function deleteUserAccount(userId) {
  await User.deleteOne({ _id: userId });
}

module.exports = {
  deleteUserAccount
};
