import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';

const faixaSchema = z.object({
  quantidadeInicial: z.number().int(),
  quantidadeFinal: z.number().int().nullable().optional(),
  acrescimo: z.number(),
});

export async function faixasRoutes(app: FastifyInstance) {
  app.get('/faixas-utilizacao', async () => prisma.faixaUtilizacao.findMany());

  app.post('/faixas-utilizacao', async (request, reply) => {
    const dados = faixaSchema.parse(request.body);
    const faixa = await prisma.faixaUtilizacao.create({ data: dados });
    return reply.status(201).send(faixa);
  });
}