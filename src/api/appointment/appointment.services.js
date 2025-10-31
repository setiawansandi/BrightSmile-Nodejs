const pool = require("../../db/db");
const dayjs = require("dayjs");

exports.getAppointments = async (userId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `
      SELECT 
        a.id AS appointment_id,
        a.patient_user_id AS patient_id,
        CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
        a.doctor_user_id AS doctor_id,
        CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
        a.status,
        DATE_FORMAT(a.appt_date, '%d/%m/%Y') AS date,
        DATE_FORMAT(a.appt_time, '%H:%i') AS time,
        a.status AS status_label
      FROM appointments a
      JOIN users p ON a.patient_user_id = p.id
      JOIN users d ON a.doctor_user_id = d.id
      WHERE a.patient_user_id = ? OR a.doctor_user_id = ?
      ORDER BY a.appt_date DESC, a.appt_time DESC
      `,
      [userId, userId]
    );

    return {
      data: rows,
      page: 1,
      limit: 50,
      total: rows.length,
    };
  } finally {
    conn.release();
  }
};

exports.getSchedule = async (doctorId, date, apptId) => {
  if (!doctorId || !date || !apptId || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("invalid input");
  }

  const conn = await pool.getConnection();
  try {
    // exclude cancelled; return id + patient_user_id to compute flags
    const [rows] = await conn.query(
      `
      SELECT 
        a.id,
        TIME_FORMAT(a.appt_time, '%H:%i') AS time
      FROM appointments a
      WHERE a.doctor_user_id = ? 
        AND a.appt_date = ?
        AND a.status = 'confirmed'
      `,
      [doctorId, date]
    );

    const apptIdStr = String(apptId);
    const data = rows.map(({ id, time }) => ({
      slot: time,
      is_mine: String(id) === apptIdStr,
    }));

    return {
      code: 200,
      data,
    };
  } finally {
    conn.release();
  }
};

exports.createAppointment = async (
  patientId,
  { doctor_id, appt_date, appt_time }
) => {
  if (
    !doctor_id ||
    !appt_date ||
    !appt_time ||
    !/^\d{4}-\d{2}-\d{2}$/.test(appt_date)
  ) {
    throw new Error("invalid input");
  }

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO appointments (patient_user_id, doctor_user_id, appt_date, appt_time)
       VALUES (?, ?, ?, ?)`,
      [patientId, doctor_id, appt_date, appt_time]
    );

    return { appointment_id: result.insertId };
  } finally {
    conn.release();
  }
};

exports.updateAppointment = async (
  patientId,
  { appt_id, doctor_id, appt_date, appt_time }
) => {
  if (
    !appt_id ||
    !doctor_id ||
    !appt_date ||
    !appt_time ||
    !/^\d{4}-\d{2}-\d{2}$/.test(appt_date)
  ) {
    throw new Error("invalid input");
  }

  const conn = await pool.getConnection();
  try {
    await conn.query(
      `UPDATE appointments
       SET doctor_user_id = ?, appt_date = ?, appt_time = ?
       WHERE id = ? AND patient_user_id = ?`,
      [doctor_id, appt_date, appt_time, appt_id, patientId]
    );

    return { appointment_id: appt_id };
  } finally {
    conn.release();
  }
};
