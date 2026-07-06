const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateAuthRequest(req, res, next) {
  const { email, password } = req.body || {};

  if (typeof email !== 'string' || !emailPattern.test(email.trim())) {
    res.status(400).json({ message: 'A valid email is required' });
    return;
  }

  if (typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 8 characters long' });
    return;
  }

  req.body.email = email.trim().toLowerCase();
  next();
}

module.exports = validateAuthRequest;
