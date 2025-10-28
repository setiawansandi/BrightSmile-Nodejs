// services/appointments.service.js
const pool = require('../db');

/**
 * Ensures doctor exists (in doctors table).
 */
async function ensureDoctorExists(doctor_user_id) {
  const [rows] = await pool.query(
    `SELECT user_id FROM doctors WHERE user_id = :id LIMIT 1`,
    { id: doctor_user_id }
  );
  if (!rows.length) {
    const e = new Error('Doctor not found');
    e.code = 404;
    throw e;
  }
}

/**
 * Checks if the doctor has a conflicting appointment at the exact date+time.
 */
async function doctorHasConflict(doctor_user_id, appt_date, appt_time, excludeApptId = null) {
  const [rows] = await pool.query(
    `SELECT id FROM appointments
     WHERE doctor_user_id = :doc
       AND appt_date = :d
       AND appt_time = :t
       ${excludeApptId ? 'AND id <> :ex' : ''}
       AND status IN ('confirmed','completed') -- treat completed as no longer available for the same slot
     LIMIT 1`,
    excludeApptId
      ? { doc: doctor_user_id, d: appt_date, t: appt_time, ex: excludeApptId }
      : { doc: doctor_user_id, d: appt_date, t: appt_time }
  );
  return rows.length > 0;
}

/**
 * Book a new appointment (status = confirmed).
 */
async function book(patient_user_id, { doctor_user_id, appt_date, appt_time }) {
  await ensureDoctorExists(doctor_user_id);

  // Guard: same-slot conflict
  if (await doctorHasConflict(doctor_user_id, appt_date, appt_time)) {
    const e = new Error('Selected time slot is unavailable');
    e.code = 409;
    throw e;
  }

  const [res] = await pool.query(
    `INSERT INTO appointments (patient_user_id, doctor_user_id, appt_date, appt_time, status)
     VALUES (:p, :d, :date, :time, 'confirmed')`,
    { p: patient_user_id, d: doctor_user_id, date: appt_date, time: appt_time }
  );

  return await getById(res.insertId);
}

/**
 * Reschedule (patient-owned, still confirmed).
 */
async function reschedule(appointment_id, patient_user_id, { appt_date, appt_time }) {
  // Load current
  const [rows] = await pool.query(
    `SELECT * FROM appointments WHERE id = :id LIMIT 1`,
    { id: appointment_id }
  );
  const appt = rows[0];
  if (!appt) { const e = new Error('Appointment not found'); e.code = 404; throw e; }
  if (appt.patient_user_id !== patient_user_id) {
    const e = new Error('Not allowed to modify this appointment'); e.code = 403; throw e;
  }
  if (appt.status !== 'confirmed') {
    const e = new Error('Only confirmed appointments may be rescheduled'); e.code = 400; throw e;
  }

  // Conflict check
  if (await doctorHasConflict(appt.doctor_user_id, appt_date, appt_time, appt.id)) {
    const e = new Error('Selected time slot is unavailable'); e.code = 409; throw e;
  }

  await pool.query(
    `UPDATE appointments
       SET appt_date = :date, appt_time = :time
     WHERE id = :id`,
    { date: appt_date, time: appt_time, id: appointment_id }
  );

  return await getById(appointment_id);
}

async function getById(id) {
  const [rows] = await pool.query(
    `SELECT id, patient_user_id, doctor_user_id, appt_date, appt_time, status, created_at, updated_at
     FROM appointments WHERE id = :id`,
    { id }
  );
  return rows[0] || null;
}

module.exports = { book, reschedule, getById };
