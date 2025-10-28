const jwt = require('jsonwebtoken');
const { hashPassword, verifyPassword, randomToken, hashToken } = require('../utils/crypto');
const users = require('./users.service');

function signJwt(user) {
  return jwt.sign(
    { sub: user.id, is_doctor: !!user.is_doctor },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '7d' }
  );
}

async function register(payload) {
  const exists = await users.findByEmail(payload.email);
  if (exists) { const e = new Error('Email already in use'); e.code = 409; throw e; }
  const password_hash = await hashPassword(payload.password); // argon2id
  const id = await users.createUser({ ...payload, password_hash, is_doctor: payload.is_doctor ? 1 : 0 });
  const user = await users.findById(id);
  const token = signJwt(user);
  return { user, token };
}

async function login({ email, password }) {
  const record = await users.findByEmail(email);
  if (!record || !(await verifyPassword(record.password_hash, password))) {
    const e = new Error('Invalid credentials'); e.code = 401; throw e;
  }
  await users.updateLoginTimestamp(record.id);
  const user = await users.findById(record.id);
  const token = signJwt(user);
  return { user, token };
}

// forgot / reset
async function createResetToken(email) {
  const user = await users.findByEmail(email);
  if (!user) return null; // don’t reveal existence
  const raw = randomToken(32);
  const hashed = hashToken(raw);
  const expires = new Date(Date.now() + 30 * 60 * 1000); // 30min
  await users.setResetToken(user.id, hashed, expires);
  return { userId: user.id, rawToken: raw, expires };
}

async function resetPassword(rawToken, newPassword) {
  const hashed = hashToken(rawToken);
  const user = await users.consumeResetToken(hashed);
  if (!user) { const e = new Error('Invalid or expired token'); e.code = 400; throw e; }
  await users.updatePassword(user.id, await hashPassword(newPassword));
}

module.exports = { register, login, createResetToken, resetPassword };
