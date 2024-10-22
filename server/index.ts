import axios from 'axios';
import Fastify, { FastifyInstance } from 'fastify';
import { CONFIG, VALID_OPERATIONS } from './config/config.js';
import { setupCORS } from './plugins/cors.js';
import { setupMySQL } from './plugins/databse/mysqlDB.js';
import { setupCalculationHistory } from './routes/calculationHistory.js';

interface MathObject {
  expression: string;
  operation: 'resolve' | 'tokenize' | 'ast' | 'calc';
  result: any;
  url: string;
}

// Automatically creates protocols for errors
const fastify = Fastify({ logger: true });

// Register plugings
await setupCORS(fastify);
await setupMySQL(fastify);
setupCalculationHistory(fastify);
fastify.log.info('Calculation history setup completed successfully...');

const insertCalculationToDB = async (
  server: FastifyInstance, // server: Instance of Fastify Server, which creates connection to MySQL
  mathObj: MathObject // mathObj: expression, operation, result
) => {
  try {
    // INSERT INTO -> table name: mathfunctions; three columns: (expression, operation, result, url); VALUES: (?,?,?,?) = placeholder
    const insertQueryCommand = `INSERT INTO mathfunctions (expression, operation, result, url) VALUES (?,?,?,?)`;
    // .query -> SQL commands directed to the databse
    await server.mysql.query(insertQueryCommand, [
      mathObj.expression,
      mathObj.operation,
      JSON.stringify(mathObj.result),
      mathObj.url,
    ]);
    server.log.info('Mathematical calculation inserted to database...');
  } catch (err) {
    server.log.error('Error inserting calculation:', err);
    throw err;
  }
};

// GET-request from Endpoint "/v1/calc" -> defintion of the route on the local Fastify-Server
fastify.get('/v1/:operation', async (request, reply): Promise<void> => {
  // Operation for different options: 'resolve', 'tokenize', 'ast', 'calc'
  const { operation } = request.params as { operation: string };
  // Reads the URL-parameters of the request f.e.: "/v1/calc?expression=2+2"
  const { expression, x } = request.query as { expression: string; x?: string };

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

    await insertCalculationToDB(fastify, {
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

// Start the Fastify-Server
const start = async (): Promise<void> => {
  try {
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
