import { listConversions, createConversion, getConversion, updateConversion, deleteConversion } from '../controllers/conversionController.js';

export default async function registerConversionRoutes(server) {
  server.route([
    { method: 'GET', path: '/api/conversions', handler: listConversions },
    { method: 'POST', path: '/api/conversions', handler: createConversion },
    { method: 'GET', path: '/api/conversions/{id}', handler: getConversion },
    { method: 'PUT', path: '/api/conversions/{id}', handler: updateConversion },
    { method: 'DELETE', path: '/api/conversions/{id}', handler: deleteConversion }
  ]);
}
