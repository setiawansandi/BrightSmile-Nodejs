// controllers/appointments.controller.js
const apptService = require('../services/appointments.service');
const { bookSchema, rescheduleSchema } = require('../validators/appointments.validators');

async function book(req, res, next) {
  try {
    const data = bookSchema.parse(req.body);
    // req.user is set by requireAuth middleware (JWT):contentReference[oaicite:5]{index=5}
    const result = await apptService.book(req.user.id, data);
    res.status(201).send(result);
  } catch (e) { next(e); }
}

async function reschedule(req, res, next) {
  try {
    const data = rescheduleSchema.parse(req.body);
    const result = await apptService.reschedule(data.appointment_id, req.user.id, {
      appt_date: data.appt_date,
      appt_time: data.appt_time
    });
    res.send(result);
  } catch (e) { next(e); }
}

module.exports = { book, reschedule };
