import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import dotenv from 'dotenv';
import { initDb, sequelize } from './setup/database.js';
import registerAuthRoutes from './routes/authRoutes.js';
import registerUserRoutes from './routes/userRoutes.js';
import registerVendorRoutes from './routes/vendorRoutes.js';
import registerProductRoutes from './routes/productRoutes.js';
import registerPriceRoutes from './routes/priceRoutes.js';
import registerInventoryRoutes from './routes/inventoryRoutes.js';
import registerConversionRoutes from './routes/conversionRoutes.js';
import registerManufacturingRoutes from './routes/manufacturingRoutes.js';

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 4000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
        headers: ['Accept', 'Content-Type', 'Authorization'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
  });

  // Register JWT plugin
  await server.register(Jwt);

  // Define JWT authentication strategy
  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: undefined
    },
    validate: (artifacts, request, h) => {
      // basic validation, user existence check can be added in route pre-handlers
      return { isValid: true, credentials: { userId: artifacts.decoded.payload.userId, role: artifacts.decoded.payload.role } };
    }
  });

  server.auth.default('jwt');

  // Health route (no auth)
  server.route({
    method: 'GET',
    path: '/',
    options: { auth: false },
    handler: () => ({ status: 'ok', service: 'hapi-pharmacy-api' })
  });

  // Initialize DB and sync models
  await initDb();
  await sequelize.sync();

  // Register routes
  await registerAuthRoutes(server);
  await registerUserRoutes(server);
  await registerVendorRoutes(server);
  await registerProductRoutes(server);
  await registerPriceRoutes(server);
  await registerInventoryRoutes(server);
  await registerConversionRoutes(server);
  await registerManufacturingRoutes(server);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
