import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { DbService } from '../services/dbService.js';
import {
  DeleteInputParams,
  QueryParams,
  UpdateInputParams,
} from '../types/math';

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
        const results = await DbService.getCalculationRecords(
          fastify,
          limit,
          offset,
          operation as string
        );
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
        const result = await DbService.deleteCalculationRecord(fastify, id);

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
        const result = await DbService.updateCalculationRecord(
          fastify,
          id,
          expression,
          operation
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
