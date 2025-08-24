import { listInventory, createInventory, updateInventory, deleteInventory } from '../controllers/inventoryController.js';

export default async function registerInventoryRoutes(server) {
  server.route([
    { method: 'GET', path: '/api/vendors/{vendorId}/inventory', handler: listInventory },
    { method: 'POST', path: '/api/vendors/{vendorId}/inventory', handler: createInventory },
    { method: 'PUT', path: '/api/vendors/{vendorId}/inventory/{id}', handler: updateInventory },
    { method: 'DELETE', path: '/api/vendors/{vendorId}/inventory/{id}', handler: deleteInventory }
  ]);
}
