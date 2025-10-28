// validators/appointments.validators.js
const { z } = require('zod');

// YYYY-MM-DD
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'appt_date must be YYYY-MM-DD');
// HH:MM (24h)
const hhmm = z.string().regex(/^\d{2}:\d{2}$/, 'appt_time must be HH:MM');

const bookSchema = z.object({
  doctor_user_id: z.number().int().positive(),
  appt_date: isoDate,
  appt_time: hhmm
});

const rescheduleSchema = z.object({
  appointment_id: z.number().int().positive(),
  appt_date: isoDate,
  appt_time: hhmm
});

module.exports = { bookSchema, rescheduleSchema };
