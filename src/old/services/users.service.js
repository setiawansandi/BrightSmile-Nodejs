const pool = require('../db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = :email LIMIT 1', { email });
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT id, email, first_name, last_name, dob, avatar_url, phone,
            last_login, created_at, updated_at, is_doctor
     FROM users WHERE id = :id`,
    { id }
  );
  return rows[0] || null;
}

async function createUser({
  email, password_hash, first_name = null, last_name = null, dob = null,
  avatar_url = null, phone = null, is_doctor = 0
}) {
  const [res] = await pool.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, dob, avatar_url, phone, is_doctor)
     VALUES (:email, :password_hash, :first_name, :last_name, :dob, :avatar_url, :phone, :is_doctor)`,
    { email, password_hash, first_name, last_name, dob, avatar_url, phone, is_doctor }
  );
  return res.insertId;
}

async function updateLoginTimestamp(id) {
  await pool.query('UPDATE users SET last_login = NOW() WHERE id = :id', { id });
}

async function updateProfile(id, fields) {
  const allowed = ['first_name', 'last_name', 'dob', 'avatar_url', 'phone'];
  const updates = [];
  const params = { id };
  for (const k of allowed) {
    if (k in fields) { updates.push(`${k} = :${k}`); params[k] = fields[k]; }
  }
  if (!updates.length) return;
  await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = :id`, params);
}

async function setResetToken(userId, tokenHash, expiresAt) {
  await pool.query(
    `UPDATE users SET token_hash = :token_hash, token_expires_at = :exp WHERE id = :id`,
    { token_hash: tokenHash, exp: expiresAt, id: userId }
  );
}

async function consumeResetToken(tokenHash) {
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE token_hash = :token_hash AND token_expires_at > NOW() LIMIT 1`,
    { token_hash: tokenHash }
  );
  return rows[0] || null;
}

async function clearResetToken(userId) {
  await pool.query(`UPDATE users SET token_hash = NULL, token_expires_at = NULL WHERE id = :id`, { id: userId });
}

async function updatePassword(userId, newHash) {
  await pool.query(
    `UPDATE users SET password_hash = :hash, token_hash = NULL, token_expires_at = NULL WHERE id = :id`,
    { hash: newHash, id: userId }
  );
}

module.exports = {
  findByEmail, findById, createUser, updateLoginTimestamp, updateProfile,
  setResetToken, consumeResetToken, clearResetToken, updatePassword
};
