import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import { User } from '../models/index.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

const registerSchema = Joi.object({
  username: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('user', 'admin').default('user')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required()
});

export const register = async (request, h) => {
  try {
    const { error, value } = registerSchema.validate(request.payload);
    if (error) return h.response({ message: error.message }).code(400);
    const { username, email, password, role } = value;

    const exists = await User.findOne({ where: { email } });
    if (exists) return h.response({ message: 'Email already registered' }).code(409);

    const hashed = await hashPassword(password);
    const user = await User.create({ username, email, password: hashed, role });

    return h.response({ id: user.id, username: user.username, email: user.email, role: user.role }).code(201);
  } catch (err) {
    console.error('Register error:', err);
    return h.response({ message: 'Failed to register user' }).code(500);
  }
};

export const login = async (request, h) => {
  const { error, value } = loginSchema.validate(request.payload);
  if (error) return h.response({ message: error.message }).code(400);

  const { email, password } = value;
  const user = await User.findOne({ where: { email } });
  if (!user) return h.response({ message: 'Invalid credentials' }).code(401);

  const ok = await verifyPassword(password, user.password);
  if (!ok) return h.response({ message: 'Invalid credentials' }).code(401);

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  return h.response({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
};
