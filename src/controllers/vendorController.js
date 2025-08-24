import Joi from '@hapi/joi';
import { Vendor } from '../models/index.js';

const vendorSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  contact_name: Joi.string().allow(null, ''),
  phone: Joi.string().allow(null, ''),
  email: Joi.string().email().allow(null, ''),
  address: Joi.string().allow(null, ''),
  status: Joi.string().valid('active', 'inactive').default('active'),
  notes: Joi.string().allow(null, '')
});

const updateSchema = vendorSchema.fork(['name'], (s) => s.optional());

const isAdmin = (request) => request.auth?.credentials?.role === 'admin';

export const listVendors = async (request, h) => {
  const vendors = await Vendor.findAll();
  return { count: vendors.length, vendors };
};

export const createVendor = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { error, value } = vendorSchema.validate(request.payload);
  if (error) return h.response({ message: error.message }).code(400);
  const vendor = await Vendor.create(value);
  return h.response(vendor).code(201);
};

export const getVendor = async (request, h) => {
  const { id } = request.params;
  const vendor = await Vendor.findByPk(id);
  if (!vendor) return h.response({ message: 'Not found' }).code(404);
  return vendor;
};

export const updateVendor = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { id } = request.params;
  const { error, value } = updateSchema.validate(request.payload);
  if (error) return h.response({ message: error.message }).code(400);
  const vendor = await Vendor.findByPk(id);
  if (!vendor) return h.response({ message: 'Not found' }).code(404);
  await vendor.update(value);
  return vendor;
};

export const deleteVendor = async (request, h) => {
  if (!isAdmin(request)) return h.response({ message: 'Forbidden' }).code(403);
  const { id } = request.params;
  const vendor = await Vendor.findByPk(id);
  if (!vendor) return h.response({ message: 'Not found' }).code(404);
  await vendor.destroy();
  return { message: 'Deleted' };
};
