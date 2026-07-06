const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
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

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const existingUser = await User.exists({ email });

    if (existingUser) {
      throw httpError(409, 'Email is already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash });

    res.status(201).json({
      user: user.toJSON(),
      token: signToken(user)
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      throw httpError(401, 'Email or password is incorrect');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw httpError(401, 'Email or password is incorrect');
    }

    res.json({
      user: user.toJSON(),
      token: signToken(user)
    });
  } catch (error) {
    next(error);
  }
}

async function deleteMe(req, res, next) {
  try {
    await User.deleteOne({ _id: req.user._id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  deleteMe,
  login,
  register
};
