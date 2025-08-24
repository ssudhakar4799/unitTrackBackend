import { listUsers, createUser, getUser, updateUser, deleteUser } from '../controllers/userController.js';

export default async function registerUserRoutes(server) {
  server.route([
    { method: 'GET', path: '/api/users', handler: listUsers },
    { method: 'POST', path: '/api/users', handler: createUser },
    { method: 'GET', path: '/api/users/{id}', handler: getUser },
    { method: 'PUT', path: '/api/users/{id}', handler: updateUser },
    { method: 'DELETE', path: '/api/users/{id}', handler: deleteUser }
  ]);
}
