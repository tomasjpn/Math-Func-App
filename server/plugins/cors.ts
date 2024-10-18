import cors from '@fastify/cors';
import { FastifyInstance } from 'fastify';

const setupCORS = async (fastify: FastifyInstance) => {
  // Register the CORS Plug-in
  fastify.register(cors, {
    origin: (origin, callback) => {
      const localhost = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
      ];
      // Ensures, that the origin URL is included in the localhost-list
      if (localhost.indexOf(origin as string) !== -1 || !origin) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed'), false);
    },
    // Methods accepted by the server
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  fastify.log.info('CORS setup completed successfully..');
};

export { setupCORS };
