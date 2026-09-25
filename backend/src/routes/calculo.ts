import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { executarCalculo } from '../motor/calcular.js';
import { getMongoDb } from '../db/mongo.js';

const entradaSchema = z.object({
  servicoId: z.string().min(1),
  categoriaId: z.string().min(1),
  regiaoId: z.string().min(1),
  quantidade: z.number().int().positive(),
});

export async function calculoRoutes(app: FastifyInstance) {
  app.post('/calculo', async (request, reply) => {
    const entrada = entradaSchema.parse(request.body);
    const resultado = await executarCalculo(entrada);

    const db = await getMongoDb();
    const insercao = await db.collection('memoria_calculo').insertOne({
      ...resultado,
      timestamp: new Date(),
    });

    return reply.status(201).send({ id: insercao.insertedId, ...resultado });
  });

  app.get('/calculo/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { ObjectId } = await import('mongodb');
    const db = await getMongoDb();
    const memoria = await db.collection('memoria_calculo').findOne({ _id: new ObjectId(id) });
    if (!memoria) return reply.status(404).send({ erro: 'Memória de cálculo não encontrada' });
    return reply.send(memoria);
  });
}