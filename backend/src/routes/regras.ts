import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';

const condicaoSchema: z.ZodType<any> = z.lazy(() =>
  z.union([
    z.object({
      operador: z.enum(['AND', 'OR']),
      regras: z.array(condicaoSchema),
    }),
    z.object({
      campo: z.string(),
      operador: z.enum(['==', '!=', '>', '<', '>=', '<=']),
      valor: z.union([z.string(), z.number()]),
    }),
  ])
);

const acaoSchema = z.object({
  tipo: z.enum(['DESCONTO', 'ACRESCIMO']),
  modo: z.enum(['PERCENTUAL', 'FIXO']),
  valor: z.number(),
});

const regraSchema = z.object({
  nome: z.string().min(1),
  prioridade: z.number().int(),
  condicoes: condicaoSchema,
  acao: acaoSchema,
});

export async function regrasRoutes(app: FastifyInstance) {
  app.get('/regras', async () => {
    return prisma.regra.findMany({ orderBy: { prioridade: 'asc' } });
  });

  app.post('/regras', async (request, reply) => {
    const dados = regraSchema.parse(request.body);
    const regra = await prisma.regra.create({
      data: {
        nome: dados.nome,
        prioridade: dados.prioridade,
        condicoes: dados.condicoes,
        acao: dados.acao,
      },
    });
    return reply.status(201).send(regra);
  });

  app.put('/regras/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const dados = regraSchema.parse(request.body);
    const regra = await prisma.regra.update({
      where: { id },
      data: {
        nome: dados.nome,
        prioridade: dados.prioridade,
        condicoes: dados.condicoes,
        acao: dados.acao,
      },
    });
    return reply.send(regra);
  });

  app.patch('/regras/:id/ativar', async (request, reply) => {
    const { id } = request.params as { id: string };
    const regra = await prisma.regra.update({
      where: { id },
      data: { ativa: true },
    });
    return reply.send(regra);
  });

  app.patch('/regras/:id/desativar', async (request, reply) => {
    const { id } = request.params as { id: string };
    const regra = await prisma.regra.update({
      where: { id },
      data: { ativa: false },
    });
    return reply.send(regra);
  });
}