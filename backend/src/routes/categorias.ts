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
}