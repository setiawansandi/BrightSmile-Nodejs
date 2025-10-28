const argon2 = require('argon2');
const crypto = require('crypto');

const hashPassword = (plain) =>
  argon2.hash(plain, { type: argon2.argon2id, timeCost: 3, memoryCost: 2 ** 16 });

const verifyPassword = (hash, plain) => argon2.verify(hash, plain);

const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

// never store plaintext tokens; store a SHA-256 hash
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

module.exports = { hashPassword, verifyPassword, randomToken, hashToken };
