const express = require('express');
const router = express.Router();
const doctorController = require('./doctor.controllers');
const authMiddleware = require('../../middleware/auth.middleware');

// Protected route
router.get('/', authMiddleware, doctorController.getAllDoctors);

module.exports = router;
