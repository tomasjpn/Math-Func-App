import cors from '@fastify/cors';
import axios from 'axios';
import Fastify from 'fastify';

// Automatically creates protocols for errors
const fastify = Fastify({ logger: true });

// Register the CORS Plug-in
fastify.register(cors, {
  // Only local host domains as origin
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  // Methods accepted by the server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});

// GET-request from Endpoint "/v1/calc" -> defintion of the route on the local Fastify-Server
fastify.get('/v1/calc', async (request, reply): Promise<void> => {
  // Reads the URL-parameters of the request f.e.: "/v1/calc?expression=2+2"
  const { expression } = request.query as { expression: string };

  try {
    // Fetching the Math-Func-Parser API
    const response = await axios.get('https://math.oglimmer.de/v1/calc', {
      params: { expression },
    });
    return response.data;
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ error: 'Error at calculating' });
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
