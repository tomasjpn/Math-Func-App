import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

interface QueryParams {
  limit?: string; // Limit for calculation record
  offset?: string; // Offset of the records
  operation?: string; // Operation of the each calculation calculationrecord
}

interface DeleteInputParams {
  id: string;
}

interface UpdateInputParams {
  expression: string;
  operation: 'resolve' | 'tokenize' | 'ast' | 'calc';
}

export const setupCalculationHistory = (fastify: FastifyInstance) => {
  // Getting Calculation Records from database
  fastify.get(
    '/calculationHistory',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const {
        limit = '10',
        offset = '0',
        operation,
      } = request.query as QueryParams;

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
        reply.send(results);
      } catch (err) {
        fastify.log.error('Error fetching calculation history:', err);
        reply
          .status(500)
          .send({ error: 'Error fetching calculation history from database' });
      }
    }
  );

  // Delete calculation record from database
  fastify.delete<{ Params: DeleteInputParams }>(
    '/calculationHistory/:id',
    async (request, reply) => {
      const { id } = request.params;

      try {
        const [result]: any = await fastify.mysql.query(
          'DELETE FROM mathfunctions WHERE id = ?',
          [id]
        );

        if (result.affectedRows === 0) {
          return reply.status(404).send({ error: 'Record not found' });
        }

        reply.send({ success: true });
      } catch (err) {
        fastify.log.error(
          'Error deleting calculation record from database:',
          err
        );
        reply
          .status(500)
          .send({ error: 'Error deleting calculation record from database' });
      }
    }
  );

  // Update calculation record from database
  fastify.put<{ Params: DeleteInputParams; Body: UpdateInputParams }>(
    '/calculationHistory/:id',
    async (request, reply) => {
      const { id } = request.params;
      const { expression, operation } = request.body;

      try {
        const [result]: any = await fastify.mysql.query(
          'UPDATE mathfunctions SET expression = ?, operation = ? WHERE id = ?',
          [expression, operation, id]
        );

        if (result.affectedRows === 0) {
          return reply.status(404).send({ error: 'Record not found' });
        }

        reply.send({ success: true });
      } catch (err) {
        fastify.log.error(
          'Error updating calculation record in the database:',
          err
        );
        reply
          .status(500)
          .send({ error: 'Error updating calculation record in the database' });
      }
    }
  );
};
