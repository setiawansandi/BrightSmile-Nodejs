const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ code: 401, error: 'Missing Authorization header' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ code: 401, error: 'Invalid token format' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = decoded; // attach decoded payload (id, email)
    next();
  } catch (err) {
    return res.status(401).json({ code: 401, error: 'Invalid or expired token' });
  }
};
