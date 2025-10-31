// src/api/user/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("./user.controllers");
const authMiddleware = require("../../middleware/auth.middleware");

// Protected route to get logged-in user info
router.get("/", authMiddleware, userController.getUserProfile);

module.exports = router;
