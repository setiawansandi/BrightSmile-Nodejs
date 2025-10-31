const pool = require("../../db/db");

exports.getUserById = async (userId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `
      SELECT 
        email,
        first_name AS firstName,
        last_name AS lastName,
        DATE_FORMAT(dob, '%Y-%m-%d') AS dob,
        avatar_url AS avatarUrl,
        phone
      FROM users
      WHERE id = ?
      `,
      [userId]
    );

    return rows[0] || null;
  } finally {
    conn.release();
  }
};
