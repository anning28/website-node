const jwt = require('jsonwebtoken');

const User = require('../models/User');
const httpError = require('../utils/httpError');

function getBearerToken(req) {
  const authorization = req.get('Authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice('Bearer '.length).trim();
}

async function authenticate(req, res, next) {
  try {
    const token = getBearerToken(req);

    if (!token) {
      throw httpError(401, 'Authentication token is required');
    }

    if (!process.env.JWT_SECRET) {
      throw httpError(500, 'JWT_SECRET is required');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);

    if (!user) {
      throw httpError(401, 'Authentication token is invalid');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(httpError(401, 'Authentication token is invalid'));
      return;
    }

    next(error);
  }
}

module.exports = authenticate;
