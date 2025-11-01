const pool = require("../../db/db");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

exports.register = async ({
  firstName,
  lastName,
  dob,
  phone,
  email,
  password,
}) => {
  if (!firstName || !lastName || !dob || !phone || !email || !password) {
    throw new Error("All fields are required");
  }

  const conn = await pool.getConnection();
  try {
    // Check if email already exists
    const [existing] = await conn.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) throw new Error("Email already registered");

    // Hash password
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

    // Insert user
    const [result] = await conn.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, dob, phone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, passwordHash, firstName, lastName, dob, phone]
    );

    const userId = result.insertId;

    // Generate JWT
    const token = jwt.sign(
      { id: userId, email, is_doctor: 0 },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    return {
      user: { id: userId, firstName, lastName, email, avatarUrl: null },
      token,
    };
  } finally {
    conn.release();
  }
};

exports.login = async ({ email, password }) => {
  if (!email || !password) throw new Error("Email and password are required");

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT id, email, password_hash, first_name, last_name, is_doctor, avatar_url
       FROM users WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) throw new Error("Invalid credentials");
    const user = rows[0];

    const isValid = await argon2.verify(user.password_hash, password);
    if (!isValid) throw new Error("Invalid credentials");

    // Update last login timestamp
    await conn.query("UPDATE users SET last_login = NOW() WHERE id = ?", [
      user.id,
    ]);

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, is_doctor: user.is_doctor },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    return {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        avatarUrl: user.avatar_url
      },
      token,
    };
  } finally {
    conn.release();
  }
};
