// If you're on Zod v4 from the root package:
const { z } = require('zod'); 
// If your project is pinned to the v4 subpath, use: const { z } = require('zod/v4');

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'dob must be YYYY-MM-DD');

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  first_name: z.string().max(100),
  last_name: z.string().max(100),
  dob: isoDate,
  avatar_url: z.url().optional(),
  phone: z.string().max(30),
  is_doctor: z.boolean().optional()
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
});

const updateProfileSchema = z.object({
  first_name: z.string().max(100).nullish(),
  last_name: z.string().max(100).nullish(),
  dob: isoDate.nullish(),
  avatar_url: z.url().nullish(),
  phone: z.string().max(30).nullish()
});

const forgotSchema = z.object({ email: z.email() });

const resetSchema = z.object({
  token: z.string().min(10),
  new_password: z.string().min(8)
});

module.exports = { registerSchema, loginSchema, updateProfileSchema, forgotSchema, resetSchema };
