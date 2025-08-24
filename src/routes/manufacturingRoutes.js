import { listOrders, createOrder, getOrder, updateOrder, deleteOrder, updateStage, executeConversion } from '../controllers/manufacturingController.js';

export default async function registerManufacturingRoutes(server) {
  server.route([
    { method: 'GET', path: '/api/manufacturing', handler: listOrders },
    { method: 'POST', path: '/api/manufacturing', handler: createOrder },
    { method: 'GET', path: '/api/manufacturing/{id}', handler: getOrder },
    { method: 'PUT', path: '/api/manufacturing/{id}', handler: updateOrder },
    { method: 'DELETE', path: '/api/manufacturing/{id}', handler: deleteOrder },
    { method: 'PATCH', path: '/api/manufacturing/{id}/stage', handler: updateStage },
    { method: 'POST', path: '/api/manufacturing/{id}/execute', handler: executeConversion }
  ]);
}
