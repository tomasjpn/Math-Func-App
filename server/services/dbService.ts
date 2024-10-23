import { FastifyInstance } from 'fastify';
import { MathObject } from '../types/math';

export class DbService {
  static async insertCalculationRecord(
    server: FastifyInstance, // server: Instance of Fastify Server, which creates connection to MySQL
    mathObj: MathObject // mathObj: expression, operation, result)
  ): Promise<void> {
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
  }

  static async getCalculationRecords(
    fastify: FastifyInstance,
    limit: string = '10',
    offset: string = '0',
    operation: string
  ) {
    try {
      // Creates a queryString
      let queryString = 'SELECT * FROM mathfunctions'; // Select all columns from the "mathfunctions" table
      const queryParams: any[] = []; // Holds any parameters that will be later included in the SQL query
      if (operation) {
        queryString += ' WHERE operation = ?'; // Operation based filter; ? = placeholder
        queryParams.push(operation); // Operation as parameter saved in queryParams
      }
      // ORDER BY -> created_at: column;  DESC: descendant order;
      queryString += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      queryParams.push(parseInt(limit), parseInt(offset));

      // Getting the result with the created queryString
      const [results] = await fastify.mysql.query(queryString, queryParams);
      return results;
    } catch (err) {
      fastify.log.error('Error fetching calculation history:', err);
      throw err;
    }
  }

  static async deleteCalculationRecord(fastify: FastifyInstance, id: string) {
    try {
      const [result]: any = await fastify.mysql.query(
        'DELETE FROM mathfunctions WHERE id = ?',
        [id]
      );
      return result;
    } catch (err) {
      fastify.log.error(
        'Error deleting calculation record from database:',
        err
      );
      throw err;
    }
  }

  static async updateCalculationRecord(
    fastify: FastifyInstance,
    id: string,
    expression: string,
    operation: string
  ) {
    try {
      const [result]: any = await fastify.mysql.query(
        'UPDATE mathfunctions SET expression = ?, operation = ? WHERE id = ?',
        [expression, operation, id]
      );

      return result;
    } catch (err) {
      fastify.log.error(
        'Error updating calculation record in the database:',
        err
      );
      throw err;
    }
  }
}
