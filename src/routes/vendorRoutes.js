import {
  listVendors,
  createVendor,
  getVendor,
  updateVendor,
  deleteVendor
} from '../controllers/vendorController.js';

export default async function registerVendorRoutes(server) {
  server.route([
    { method: 'GET', path: '/api/vendors', handler: listVendors },
    { method: 'POST', path: '/api/vendors', handler: createVendor },
    { method: 'GET', path: '/api/vendors/{id}', handler: getVendor },
    { method: 'PUT', path: '/api/vendors/{id}', handler: updateVendor },
    { method: 'DELETE', path: '/api/vendors/{id}', handler: deleteVendor }
  ]);
}
