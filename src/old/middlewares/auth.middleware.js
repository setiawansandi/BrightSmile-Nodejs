const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).send({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, is_doctor: !!payload.is_doctor };
    return next();
  } catch {
    return res.status(401).send({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth };
