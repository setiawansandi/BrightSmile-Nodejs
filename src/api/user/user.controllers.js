// src/api/user/user.controllers.js
const userService = require("./user.services");

exports.getUserProfile = async (req, res, next) => {
  try {
    // user ID is set by authMiddleware
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    res.status(200).json({ code: 200, data: user });
  } catch (err) {
    next(err);
  }
};
