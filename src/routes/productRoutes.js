import {
  listProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

export default async function registerProductRoutes(server) {
  server.route([
    { method: 'GET', path: '/api/products', handler: listProducts },
    { method: 'POST', path: '/api/products', handler: createProduct },
    { method: 'GET', path: '/api/products/{id}', handler: getProduct },
    { method: 'PUT', path: '/api/products/{id}', handler: updateProduct },
    { method: 'DELETE', path: '/api/products/{id}', handler: deleteProduct }
  ]);
}
