import Joi from '@hapi/joi';
import { ManufacturingOrder, Product, Vendor, Conversion, VendorProduct } from '../models/index.js';

const orderSchema = Joi.object({
  product_id: Joi.number().integer().required(),
  vendor_id: Joi.number().integer().allow(null),
  input_product_id: Joi.number().integer().required(),
  input_qty: Joi.number().precision(3).min(0).required(),
  output_expected: Joi.number().precision(3).min(0).allow(null),
  stage: Joi.string().valid('received', 'processing', 'converted', 'packaged', 'completed').default('received'),
  notes: Joi.string().allow(null, '')
});

const stageSchema = Joi.object({
  stage: Joi.string().valid('received', 'processing', 'converted', 'packaged', 'completed').required()
});

const executeSchema = Joi.object({
  conversion_id: Joi.number().integer().required(),
  output_actual: Joi.number().precision(3).min(0).required()
});

const updateSchema = orderSchema.fork(['product_id','input_product_id','input_qty'], (s) => s.optional());

const isAdmin = (request) => request.auth?.credentials?.role === 'admin';

export const listOrders = async () => {
  const rows = await ManufacturingOrder.findAll();
  return { count: rows.length, orders: rows };
};

export const createOrder = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { error, value } = orderSchema.validate(request.payload);
  if (error) return h.response({ message: error.message }).code(400);

  const product = await Product.findByPk(value.product_id);
  const inputProduct = await Product.findByPk(value.input_product_id);
  if (!product || !inputProduct) return h.response({ message: 'Invalid product(s)' }).code(400);
  if (value.vendor_id) {
    const vendor = await Vendor.findByPk(value.vendor_id);
    if (!vendor) return h.response({ message: 'Vendor not found' }).code(404);
  }

  const row = await ManufacturingOrder.create(value);
  return h.response(row).code(201);
};

export const getOrder = async (request, h) => {
  const { id } = request.params;
  const row = await ManufacturingOrder.findByPk(id);
  if (!row) return h.response({ message: 'Not found' }).code(404);
  return row;
};

export const updateOrder = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { id } = request.params;
  const { error, value } = updateSchema.validate(request.payload);
  if (error) return h.response({ message: error.message }).code(400);
  const row = await ManufacturingOrder.findByPk(id);
  if (!row) return h.response({ message: 'Not found' }).code(404);
  await row.update(value);
  return row;
};

export const deleteOrder = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { id } = request.params;
  const row = await ManufacturingOrder.findByPk(id);
  if (!row) return h.response({ message: 'Not found' }).code(404);
  await row.destroy();
  return { message: 'Deleted' };
};

export const updateStage = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { id } = request.params;
  const { error, value } = stageSchema.validate(request.payload);
  if (error) return h.response({ message: error.message }).code(400);
  const row = await ManufacturingOrder.findByPk(id);
  if (!row) return h.response({ message: 'Not found' }).code(404);
  await row.update({ stage: value.stage });
  return row;
};

export const executeConversion = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { id } = request.params;
  const { error, value } = executeSchema.validate(request.payload);
  if (error) return h.response({ message: error.message }).code(400);

  const order = await ManufacturingOrder.findByPk(id);
  if (!order) return h.response({ message: 'Order not found' }).code(404);

  const conv = await Conversion.findByPk(value.conversion_id);
  if (!conv) return h.response({ message: 'Conversion not found' }).code(404);
  if (conv.from_product_id !== order.input_product_id || conv.to_product_id !== order.product_id) {
    return h.response({ message: 'Conversion does not match order products' }).code(400);
  }

  // Adjust inventory if vendor provided
  if (order.vendor_id) {
    const inv = await VendorProduct.findOne({ where: { vendor_id: order.vendor_id, product_id: order.input_product_id } });
    if (!inv || Number(inv.qty) < Number(order.input_qty)) {
      return h.response({ message: 'Insufficient input inventory for vendor' }).code(400);
    }
    await inv.update({ qty: Number(inv.qty) - Number(order.input_qty) });

    // add output product to vendor inventory
    const outInv = await VendorProduct.findOne({ where: { vendor_id: order.vendor_id, product_id: order.product_id } });
    if (outInv) {
      await outInv.update({ qty: Number(outInv.qty) + Number(value.output_actual) });
    } else {
      await VendorProduct.create({ vendor_id: order.vendor_id, product_id: order.product_id, qty: value.output_actual, status: 'available' });
    }
  }

  await order.update({ stage: 'completed', output_actual: value.output_actual, completed_at: new Date() });
  return order;
};
