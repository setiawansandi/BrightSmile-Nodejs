const authService = require('./auth.services');

exports.register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(200).json({ code: 200, data: result });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ code: 200, data: result });
  } catch (err) {
    next(err);
  }
};
