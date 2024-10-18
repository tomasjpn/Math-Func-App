import fastifyMySQL from '@fastify/mysql';
import dotenv from 'dotenv';
import { FastifyInstance } from 'fastify';

dotenv.config(); // Load env variables

declare module 'fastify' {
  interface FastifyInstance {
    mysql: {
      query: (sql: string, values?: any[]) => Promise<any>;
    };
  }
}

export const setupMySQL = async (server: FastifyInstance) => {
  try {
    // Register MySQL
    await server.register(fastifyMySQL, {
      promise: true, // Use Promises instead of callbacks
      connectionString: process.env.MYSQL_CONNECTION_STRING, // connectionString for the database
    });

    const testConnection = await server.mysql.query('SELECT 1');
    server.log.info('MySQL connection test successful:', testConnection);

    // Creates table: mathfunctions if it does not exist
    await server.mysql.query(`
      CREATE TABLE IF NOT EXISTS mathfunctions ( 
        id INT AUTO_INCREMENT PRIMARY KEY, 
        expression VARCHAR(255) NOT NULL,
        operation ENUM('resolve', 'tokenize', 'ast', 'calc') NOT NULL,
        result JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    server.log.info('MySQL table "mathFunctions" created...');
    server.log.info('MySQL setup completed successfully...');
  } catch (err) {
    server.log.error('Error setting up MySQL:', err);
    throw err;
  }
};
