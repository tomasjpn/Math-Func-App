import Fastify from 'fastify';
import { CONFIG } from './config/config.js';
import { setupCORS } from './plugins/cors.js';
import { setupMySQL } from './plugins/databse/mysqlDB.js';
import { setupCalculationHistory } from './routes/calculationHistory.js';
import { setUpMathOperations } from './routes/mathOperation.js';

// Automatically creates protocols for errors
const fastify = Fastify({ logger: true });

// Start the Fastify-Server
const start = async (): Promise<void> => {
  try {
    // Register plugings
    await setupCORS(fastify);
    await setupMySQL(fastify);

    // Setup routes
    setupCalculationHistory(fastify);
    fastify.log.info('Calculation history setup completed successfully...');
    setUpMathOperations(fastify);
    fastify.log.info('Math operations setup completed successfully...');

    // Listen to port 3000 requests, host 0000 -> listens to all network interfaces
    await fastify.listen({
      port: CONFIG.server.port,
      host: CONFIG.server.host,
    });
    fastify.log.info(
      `Server successfully running on http://localhost:${CONFIG.server.port}`
    );
  } catch (err) {
    fastify.log.error('Error starting server: ', err);
    process.exit(1);
  }
};

start();
