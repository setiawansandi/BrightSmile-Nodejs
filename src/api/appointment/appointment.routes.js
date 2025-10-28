const express = require('express');
const router = express.Router();
const appointmentController = require('./appointment.controllers');
const authMiddleware = require('../../middleware/auth.middleware');

// All routes require valid JWT
router.get('/', authMiddleware, appointmentController.getAppointments);
router.get('/schedule', authMiddleware, appointmentController.getSchedule);
router.post('/', authMiddleware, appointmentController.createAppointment);
router.put('/', authMiddleware, appointmentController.updateAppointment);

module.exports = router;
