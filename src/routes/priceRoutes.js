import { listPrices, createPrices, updatePrice, deletePrice } from '../controllers/priceController.js';

export default async function registerPriceRoutes(server) {
  server.route([
    { method: 'GET', path: '/api/products/{productId}/prices', handler: listPrices },
    { method: 'POST', path: '/api/products/{productId}/prices', handler: createPrices },
    { method: 'PUT', path: '/api/products/{productId}/prices/{priceId}', handler: updatePrice },
    { method: 'DELETE', path: '/api/products/{productId}/prices/{priceId}', handler: deletePrice }
  ]);
}
