import axios from 'axios';
import Fastify from 'fastify';
import { setupCORS } from './plugins/cors.js';

// Automatically creates protocols for errors
const fastify = Fastify({ logger: true });

// Register plugings
setupCORS(fastify);

// GET-request from Endpoint "/v1/calc" -> defintion of the route on the local Fastify-Server
fastify.get('/v1/:operation', async (request, reply): Promise<void> => {
  // Operation for different options: 'resolve', 'tokenize', 'ast', 'calc'
  const { operation } = request.params as { operation: string };
  // Reads the URL-parameters of the request f.e.: "/v1/calc?expression=2+2"
  const { expression, x } = request.query as { expression: string; x: string };

  // If operation is not valid
  if (!['resolve', 'tokenize', 'ast', 'calc'].includes(operation)) {
    return reply.status(400).send({ error: 'Invalid operation!' });
  }

  if (!expression) {
    // If value is missing in the expression Input
    return reply.status(400).send({ error: 'Expression is required!' });
  }

  try {
    // Fetching the Math-Func-Parser API
    const response = await axios.get(
      `https://math.oglimmer.de/v1/${operation}`,
      {
        params: { expression, x },
      }
    );
    console.log(`API response: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (err) {
    fastify.log.error(err);
    return reply
      .status(500)
      .send({ error: `Error at ${operation} operation!` });
  }
});

// Start the Fastify-Server
const start = async (): Promise<void> => {
  try {
    // Listen to port 3000 requests, host 0000 -> listens to all network interfaces
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
