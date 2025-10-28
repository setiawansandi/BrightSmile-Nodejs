const usersService = require('../services/users.service');
const { updateProfileSchema } = require('../validators/users.validators');

async function me(req, res, next) {
  try {
    const user = await usersService.findById(req.user.id);
    res.send({ user });
  } catch (e) { next(e); }
}

async function updateMe(req, res, next) {
  try {
    const patch = updateProfileSchema.parse(req.body);
    await usersService.updateProfile(req.user.id, patch);
    const user = await usersService.findById(req.user.id);
    res.send({ user });
  } catch (e) { next(e); }
}

module.exports = { me, updateMe};
