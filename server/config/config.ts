import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  server: {
    port: parseInt(process.env.SERVER_PORT || '3000'),
    host: process.env.SERVER_HOST || '0.0.0.0',
  },
  api: {
    mathApiBaseUrl:
      process.env.MATH_API_BASE_URL || 'https://math.oglimmer.de/v1/',
  },
  db: {
    connectionString: process.env.MYSQL_CONNECTION_STRING,
  },
};

export const VALID_OPERATIONS = ['resolve', 'tokenize', 'ast', 'calc'];
