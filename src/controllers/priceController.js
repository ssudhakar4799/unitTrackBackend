import Joi from '@hapi/joi';
import { PriceTier, Product } from '../models/index.js';

const priceSchema = Joi.object({
  type: Joi.string().valid('cost', 'selling', 'wholesale', 'retail').required(),
  price: Joi.number().precision(2).min(0).required(),
  currency: Joi.string().default('INR')
});

const isAdmin = (request) => request.auth?.credentials?.role === 'admin';

export const listPrices = async (request, h) => {
  const { productId } = request.params;
  const prices = await PriceTier.findAll({ where: { product_id: productId } });
  return { count: prices.length, prices };
};

export const createPrices = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { productId } = request.params;
  const payload = Array.isArray(request.payload) ? request.payload : [request.payload];

  // validate product
  const product = await Product.findByPk(productId);
  if (!product) return h.response({ message: 'Product not found' }).code(404);

  const rows = [];
  for (const p of payload) {
    const { error, value } = priceSchema.validate(p);
    if (error) return h.response({ message: error.message }).code(400);
    const created = await PriceTier.upsert({ ...value, product_id: productId });
    rows.push(created[0]);
  }
  return h.response(rows).code(201);
};

export const updatePrice = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { productId, priceId } = request.params;
  const { error, value } = priceSchema.fork(['type'], (s) => s.optional()).validate(request.payload);
  if (error) return h.response({ message: error.message }).code(400);
  const price = await PriceTier.findOne({ where: { id: priceId, product_id: productId } });
  if (!price) return h.response({ message: 'Not found' }).code(404);
  await price.update(value);
  return price;
};

export const deletePrice = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { productId, priceId } = request.params;
  const price = await PriceTier.findOne({ where: { id: priceId, product_id: productId } });
  if (!price) return h.response({ message: 'Not found' }).code(404);
  await price.destroy();
  return { message: 'Deleted' };
};
