import axios from 'axios';
import { FastifyInstance } from 'fastify';
import { CONFIG, VALID_OPERATIONS } from '../config/config.js';
import { DbService } from '../services/dbService.js';

export const setUpMathOperations = (fastify: FastifyInstance) => {
  // GET-request from Endpoint "/v1/calc" -> defintion of the route on the local Fastify-Server
  fastify.get('/v1/:operation', async (request, reply): Promise<void> => {
    // Operation for different options: 'resolve', 'tokenize', 'ast', 'calc'
    const { operation } = request.params as { operation: string };
    // Reads the URL-parameters of the request f.e.: "/v1/calc?expression=2+2"
    const { expression, x } = request.query as {
      expression: string;
      x?: string;
    };

    fastify.log.info(
      `Request for operation: ${operation} with expression: ${expression}`
    );

    // If operation is not valid
    if (!VALID_OPERATIONS.includes(operation)) {
      return reply.status(400).send({ error: 'Invalid operation!' });
    }

    if (!expression) {
      // If value is missing in the expression Input
      return reply.status(400).send({ error: 'Expression is required!' });
    }

    try {
      // Fetching the Math-Func-Parser API
      const response = await axios.get(
        `${CONFIG.api.mathApiBaseUrl}${operation}`,
        {
          params: { expression, x },
        }
      );

      // Constructing full URL
      const fullUrl = `${request.protocol}://${request.hostname}${request.url}`;
      console.log(fullUrl);

      console.log(
        `API response for operation: "${operation}": ${JSON.stringify(
          response.data
        )}`
      );

      await DbService.insertCalculationRecord(fastify, {
        expression,
        operation: operation as 'resolve' | 'tokenize' | 'ast' | 'calc',
        result: response.data,
        url: fullUrl,
      });

      return reply.send(response.data);
    } catch (err) {
      fastify.log.error(err);
      return reply
        .status(500)
        .send({ error: `Error at ${operation} operation!` });
    }
  });
};
