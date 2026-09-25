import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';

const categoriaSchema = z.object({
  codigo: z.number().int(),
  nome: z.string().min(1),
});

export async function categoriasRoutes(app: FastifyInstance) {
  app.get('/categorias', async () => prisma.categoria.findMany());

  app.post('/categorias', async (request, reply) => {
    const dados = categoriaSchema.parse(request.body);
    const categoria = await prisma.categoria.create({ data: dados });
    return reply.status(201).send(categoria);
  });

  app.delete('/categorias/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await prisma.categoria.delete({ where: { id } });
    return reply.status(204).send();
  });
}