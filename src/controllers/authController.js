const { loginUser, registerUser } = require('../services/authService');

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await registerUser({ email, password });

    res.status(201).json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });

    res.json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  register
};
