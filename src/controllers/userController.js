import Joi from '@hapi/joi';
import { User } from '../models/index.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

const createSchema = Joi.object({
  username: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('user', 'admin').default('user')
});

const updateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(128).optional(),
  role: Joi.string().valid('user', 'admin').optional()
}).min(1);

export const listUsers = async (request, h) => {
  console.log(request.auth.credentials,"request.auth.credentials");
  const { role } = request.auth.credentials;
  if (role !== 'admin') return h.response({ message: 'Forbidden' }).code(403);

  const users = await User.findAll({ attributes: ['id', 'username', 'email', 'role'] });
  return { count: users.length, users };
};

export const createUser = async (request, h) => {
  const { role } = request.auth.credentials;
  if (role !== 'admin') return h.response({ message: 'Forbidden' }).code(403);

  const { error, value } = createSchema.validate(request.payload);
  if (error) return h.response({ message: error.message }).code(400);

  const existing = await User.findOne({ where: { email: value.email } });
  if (existing) return h.response({ message: 'Email already registered' }).code(409);

  const password = await hashPassword(value.password);
  const user = await User.create({ username: value.username, email: value.email, password, role: value.role });
  return h.response({ id: user.id, username: user.username, email: user.email, role: user.role }).code(201);
};

export const getUser = async (request, h) => {
  const { id } = request.params;
  const { userId, role } = request.auth.credentials;
  if (role !== 'admin' && parseInt(id, 10) !== userId) return h.response({ message: 'Forbidden' }).code(403);

  const user = await User.findByPk(id, { attributes: ['id', 'username', 'email', 'role'] });
  if (!user) return h.response({ message: 'Not found' }).code(404);
  return user;
};

export const updateUser = async (request, h) => {
  const { id } = request.params;
  const { userId, role } = request.auth.credentials;
  if (role !== 'admin' && parseInt(id, 10) !== userId) return h.response({ message: 'Forbidden' }).code(403);

  const { error, value } = updateSchema.validate(request.payload);
  if (error) return h.response({ message: error.message }).code(400);

  const user = await User.findByPk(id);
  if (!user) return h.response({ message: 'Not found' }).code(404);

  if (value.email && value.email !== user.email) {
    const exists = await User.findOne({ where: { email: value.email } });
    if (exists) return h.response({ message: 'Email already in use' }).code(409);
  }

  if (value.password) {
    value.password = await hashPassword(value.password);
    delete value.password;
  }

  await user.update(value);
  return { id: user.id, username: user.username, email: user.email, role: user.role };
};

export const deleteUser = async (request, h) => {
  const { id } = request.params;
  const { role } = request.auth.credentials;
  if (role !== 'admin') return h.response({ message: 'Forbidden' }).code(403);

  const user = await User.findByPk(id);
  if (!user) return h.response({ message: 'Not found' }).code(404);

  await user.destroy();
  return h.response().code(204);
};
