import Joi from '@hapi/joi';
import { VendorProduct, Vendor, Product } from '../models/index.js';

const inventorySchema = Joi.object({
  product_id: Joi.number().integer().required(),
  qty: Joi.number().precision(3).min(0).required(),
  status: Joi.string().valid('available', 'reserved', 'depleted').default('available')
});

const updateSchema = Joi.object({
  qty: Joi.number().precision(3).min(0),
  status: Joi.string().valid('available', 'reserved', 'depleted')
}).min(1);

const isAdmin = (request) => request.auth?.credentials?.role === 'admin';

export const listInventory = async (request, h) => {
  const { vendorId } = request.params;
  const rows = await VendorProduct.findAll({ where: { vendor_id: vendorId } });
  return { count: rows.length, inventory: rows };
};

export const createInventory = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { vendorId } = request.params;
  const { error, value } = inventorySchema.validate(request.payload);
  if (error) return h.response({ message: error.message }).code(400);

  const vendor = await Vendor.findByPk(vendorId);
  if (!vendor) return h.response({ message: 'Vendor not found' }).code(404);

  const product = await Product.findByPk(value.product_id);
  if (!product) return h.response({ message: 'Product not found' }).code(404);

  const row = await VendorProduct.upsert({ vendor_id: vendorId, product_id: value.product_id, qty: value.qty, status: value.status });
  return h.response(row[0]).code(201);
};

export const updateInventory = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { vendorId, id } = request.params;
  const { error, value } = updateSchema.validate(request.payload);
  if (error) return h.response({ message: error.message }).code(400);
  const row = await VendorProduct.findOne({ where: { id, vendor_id: vendorId } });
  if (!row) return h.response({ message: 'Not found' }).code(404);
  await row.update(value);
  return row;
};

export const deleteInventory = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { vendorId, id } = request.params;
  const row = await VendorProduct.findOne({ where: { id, vendor_id: vendorId } });
  if (!row) return h.response({ message: 'Not found' }).code(404);
  await row.destroy();
  return { message: 'Deleted' };
};
