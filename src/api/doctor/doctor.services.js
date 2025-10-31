const pool = require('../../db/db');

exports.getAllDoctors = async () => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(`
      SELECT 
        d.user_id AS doctor_id,
        CONCAT(u.first_name, ' ', u.last_name) AS doctor_name,
        u.avatar_url,
        d.specialization,
        d.bio
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      ORDER BY u.last_name, u.first_name
    `);

    return rows;
  } finally {
    conn.release();
  }
};
