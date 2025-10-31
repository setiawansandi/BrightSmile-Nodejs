const appointmentService = require("./appointment.services");

exports.getAppointments = async (req, res, next) => {
  try {
    const userId = req.query.user || req.user.id; // use token ID if no query param
    const result = await appointmentService.getAppointments(userId);
    res.status(200).json({ code: 200, ...result });
  } catch (err) {
    next(err);
  }
};

exports.getSchedule2 = async (req, res, next) => {
  try {
    const result = await appointmentService.getSchedule(
      req.query.doctor,
      req.query.date
    );
    res.status(200).json({ code: 200, data: result });
  } catch (err) {
    if (err.message === "invalid input")
      return res.status(400).json({ code: 400, error: "invalid input" });
    next(err);
  }
};

exports.getSchedule = async (req, res, next) => {
  try {
    const doctorId = parseInt(req.query.doctor, 10);
    const date = req.query.date;
    const apptId = parseInt(req.query.apptId, 10);

    const bookedTimes = await appointmentService.getSchedule(
      doctorId,
      date,
      apptId,
    );

    res.status(200).json(bookedTimes);
  } catch (err) {
    if (err.message === "invalid input") {
      return res.status(400).json({ error: "invalid input" });
    }
    next(err);
  }
};

exports.createAppointment = async (req, res, next) => {
  try {
    const result = await appointmentService.createAppointment(
      req.user.id,
      req.body
    );
    res.status(200).json({ code: 200, data: result });
  } catch (err) {
    if (err.message === "invalid input")
      return res.status(400).json({ code: 400, error: "invalid input" });
    next(err);
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const result = await appointmentService.updateAppointment(
      req.user.id,
      req.body
    );
    res.status(200).json({ code: 200, data: result });
  } catch (err) {
    if (err.message === "invalid input")
      return res.status(400).json({ code: 400, error: "invalid input" });
    next(err);
  }
};
