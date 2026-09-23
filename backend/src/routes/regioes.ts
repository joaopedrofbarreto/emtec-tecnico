import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';

const regiaoSchema = z.object({
  codigo: z.number().int(),
  nome: z.string().min(1),
  fatorPreco: z.number().positive(),
});

export async function regioesRoutes(app: FastifyInstance) {
  app.get('/regioes', async () => prisma.regiao.findMany());

  app.post('/regioes', async (request, reply) => {
    const dados = regiaoSchema.parse(request.body);
    const regiao = await prisma.regiao.create({ data: dados });
    return reply.status(201).send(regiao);
  });

  app.delete('/regioes/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await prisma.regiao.delete({ where: { id: Number(id) } });
    return reply.status(204).send();
  });
}