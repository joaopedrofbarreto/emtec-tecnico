import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';

const servicoSchema = z.object({
  codigo: z.number().int(),
  nome: z.string().min(1),
  valorBase: z.number().positive(),
});

export async function servicosRoutes(app: FastifyInstance) {
  app.get('/servicos', async () => {
    return prisma.servico.findMany();
  });

  app.post('/servicos', async (request, reply) => {
    const dados = servicoSchema.parse(request.body);
    const servico = await prisma.servico.create({ data: dados });
    return reply.status(201).send(servico);
  });

  app.delete('/servicos/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await prisma.servico.delete({ where: { id: Number(id) } });
    return reply.status(204).send();
  });
}