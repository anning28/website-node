const bcrypt = require('bcryptjs');

const User = require('../models/User');
const httpError = require('../utils/httpError');
const { signToken } = require('./tokenService');

async function registerUser({ email, password }) {
  const existingUser = await User.exists({ email });

  if (existingUser) {
    throw httpError(409, 'Email is already registered');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash });

  return {
    user,
    token: signToken(user)
  };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw httpError(401, 'Email or password is incorrect');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw httpError(401, 'Email or password is incorrect');
  }

  return {
    user,
    token: signToken(user)
  };
}

module.exports = {
  loginUser,
  registerUser
};
