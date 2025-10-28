// routes/appointments.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/appointments.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.post('/book', requireAuth, ctrl.book);
router.post('/reschedule', requireAuth, ctrl.reschedule);

module.exports = router;
