const doctorService = require('./doctor.services');

exports.getAllDoctors = async (req, res, next) => {
  try {
    const result = await doctorService.getAllDoctors();
    res.status(200).json({ code: 200, data: result });
  } catch (err) {
    next(err);
  }
};
