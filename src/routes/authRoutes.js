import { register, login } from '../controllers/authController.js';

export default async function registerAuthRoutes(server) {
  server.route([
    {
      method: 'POST',
      path: '/api/auth/register',
      options: { auth: false },
      handler: register
    },
    {
      method: 'POST',
      path: '/api/auth/login',
      options: { auth: false },
      handler: login
    }
  ]);
}
