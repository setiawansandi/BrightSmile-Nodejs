const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
});

pool.check = async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();

    const host = process.env.DB_HOST || '127.0.0.1';
    const port = Number(process.env.DB_PORT) || 3306;
    const db   = process.env.DB_DATABASE || '(no database selected)';
    const msg  = `MySQL connected → ${host}:${port}/${db}`;
    console.log(msg);
    return { ok: true, message: msg };
  } catch (e) {
    const msg = `MySQL connection failed: ${e.code || ''} ${e.message}`;
    console.error(msg);
    return { ok: false, message: msg, error: e };
  }
};

// quick connectivity check on startup (optional)
(async () => { await pool.check(); })();

module.exports = pool;
