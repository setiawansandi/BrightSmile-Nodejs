const router = require('express').Router();
const { requireAuth } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/users.controller');

router.get('/me', requireAuth, ctrl.me);
router.patch('/me', requireAuth, ctrl.updateMe);

module.exports = router;