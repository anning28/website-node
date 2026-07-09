const jwt = require('jsonwebtoken');

const httpError = require('../utils/httpError');

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw httpError(500, 'JWT_SECRET is required');
  }

  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
}

module.exports = {
  signToken
};
