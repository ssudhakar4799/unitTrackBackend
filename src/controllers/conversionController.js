import Joi from '@hapi/joi';
import { Conversion, Product } from '../models/index.js';

const conversionSchema = Joi.object({
  from_product_id: Joi.number().integer().required(),
  to_product_id: Joi.number().integer().required(),
  input_qty: Joi.number().precision(3).min(0).required(),
  output_qty: Joi.number().precision(3).min(0).required(),
  waste_qty: Joi.number().precision(3).min(0).default(0),
  status: Joi.string().valid('draft', 'in_progress', 'completed').default('draft'),
  notes: Joi.string().allow(null, '')
});

const updateSchema = conversionSchema.fork(['from_product_id','to_product_id'], (s) => s.optional());

const isAdmin = (request) => request.auth?.credentials?.role === 'admin';

export const listConversions = async () => {
  const rows = await Conversion.findAll();
  return { count: rows.length, conversions: rows };
};

export const createConversion = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { error, value } = conversionSchema.validate(request.payload);
  if (error) return h.response({ message: error.message }).code(400);

  const from = await Product.findByPk(value.from_product_id);
  const to = await Product.findByPk(value.to_product_id);
  if (!from || !to) return h.response({ message: 'Invalid product(s)' }).code(400);

  const row = await Conversion.create(value);
  return h.response(row).code(201);
};

export const getConversion = async (request, h) => {
  const { id } = request.params;
  const row = await Conversion.findByPk(id);
  if (!row) return h.response({ message: 'Not found' }).code(404);
  return row;
};

export const updateConversion = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { id } = request.params;
  const { error, value } = updateSchema.validate(request.payload);
  if (error) return h.response({ message: error.message }).code(400);
  const row = await Conversion.findByPk(id);
  if (!row) return h.response({ message: 'Not found' }).code(404);
  await row.update(value);
  return row;
};

export const deleteConversion = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { id } = request.params;
  const row = await Conversion.findByPk(id);
  if (!row) return h.response({ message: 'Not found' }).code(404);
  await row.destroy();
  return { message: 'Deleted' };
};
