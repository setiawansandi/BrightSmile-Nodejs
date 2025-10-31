const express = require('express');
const router = express.Router();
const doctorController = require('./doctor.controllers');

// Protected route
router.get('/', doctorController.getAllDoctors);

module.exports = router;
