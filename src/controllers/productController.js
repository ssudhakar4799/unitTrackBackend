import Joi from '@hapi/joi';
import { Product } from '../models/index.js';

const productSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  sku: Joi.string().allow(null, ''),
  unit: Joi.string().allow(null, ''),
  description: Joi.string().allow(null, ''),
  status: Joi.string().valid('active', 'inactive').default('active')
});

const updateSchema = productSchema.fork(['name'], (s) => s.optional());

const isAdmin = (request) => request.auth?.credentials?.role === 'admin';

export const listProducts = async () => {
  const products = await Product.findAll();
  return { count: products.length, products };
};

export const createProduct = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { error, value } = productSchema.validate(request.payload);
  if (error) return h.response({ message: error.message }).code(400);
  const product = await Product.create(value);
  return h.response(product).code(201);
};

export const getProduct = async (request, h) => {
  const { id } = request.params;
  const product = await Product.findByPk(id);
  if (!product) return h.response({ message: 'Not found' }).code(404);
  return product;
};

export const updateProduct = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { id } = request.params;
  const { error, value } = updateSchema.validate(request.payload);
  if (error) return h.response({ message: error.message }).code(400);
  const product = await Product.findByPk(id);
  if (!product) return h.response({ message: 'Not found' }).code(404);
  await product.update(value);
  return product;
};

export const deleteProduct = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { id } = request.params;
  const product = await Product.findByPk(id);
  if (!product) return h.response({ message: 'Not found' }).code(404);
  await product.destroy();
  return { message: 'Deleted' };
};
