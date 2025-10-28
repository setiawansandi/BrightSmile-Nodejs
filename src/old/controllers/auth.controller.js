const authService = require('../services/auth.service');
const { registerSchema, loginSchema, forgotSchema, resetSchema } = require('../validators/users.validators');

async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const out = await authService.register(data);
    res.status(201).send(out);
  } catch (e) { next(e); }
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const out = await authService.login(data);
    res.send(out);
  } catch (e) { next(e); }
}

async function forgot(req, res, next) {
  try {
    const { email } = forgotSchema.parse(req.body);
    const result = await authService.createResetToken(email);
    // If result, email rawToken via your mailer; here we just return a generic success.
    res.send({ ok: true });
  } catch (e) { next(e); }
}

async function reset(req, res, next) {
  try {
    const { token, new_password } = resetSchema.parse(req.body);
    await authService.resetPassword(token, new_password);
    res.send({ ok: true });
  } catch (e) { next(e); }
}

module.exports = { register, login, forgot, reset };
