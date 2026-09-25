import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.servico.upsert({ where: { codigo: 1 }, update: {}, create: { codigo: 1, nome: 'Suporte Tecnico', valorBase: 100 } });
  await prisma.servico.upsert({ where: { codigo: 2 }, update: {}, create: { codigo: 2, nome: 'Consultoria', valorBase: 200 } });
  await prisma.servico.upsert({ where: { codigo: 3 }, update: {}, create: { codigo: 3, nome: 'Desenvolvimento', valorBase: 300 } });

  await prisma.categoria.upsert({ where: { codigo: 1 }, update: {}, create: { codigo: 1, nome: 'Publico' } });
  await prisma.categoria.upsert({ where: { codigo: 2 }, update: {}, create: { codigo: 2, nome: 'Privado' } });
  await prisma.categoria.upsert({ where: { codigo: 3 }, update: {}, create: { codigo: 3, nome: 'Estrategico' } });

  await prisma.regiao.upsert({ where: { codigo: 1 }, update: {}, create: { codigo: 1, nome: 'Local', fatorPreco: 1.0 } });
  await prisma.regiao.upsert({ where: { codigo: 2 }, update: {}, create: { codigo: 2, nome: 'Regional', fatorPreco: 1.1 } });
  await prisma.regiao.upsert({ where: { codigo: 3 }, update: {}, create: { codigo: 3, nome: 'Nacional', fatorPreco: 1.25 } });

  const faixasExistentes = await prisma.faixaUtilizacao.count();
  if (faixasExistentes === 0) {
    await prisma.faixaUtilizacao.createMany({
      data: [
        { quantidadeInicial: 1, quantidadeFinal: 10, acrescimo: 0 },
        { quantidadeInicial: 11, quantidadeFinal: 50, acrescimo: 5 },
        { quantidadeInicial: 51, quantidadeFinal: 100, acrescimo: 10 },
        { quantidadeInicial: 101, quantidadeFinal: null, acrescimo: 20 },
      ],
    });
  }

  const regrasExistentes = await prisma.regra.count();
  if (regrasExistentes === 0) {
    await prisma.regra.createMany({
      data: [
        {
          nome: 'Desconto Estrategico Alto Volume',
          prioridade: 1,
          condicoes: { operador: 'AND', regras: [
            { campo: 'categoriaCliente', operador: '==', valor: 'Estrategico' },
            { campo: 'quantidade', operador: '>', valor: 50 },
          ]},
          acao: { tipo: 'DESCONTO', modo: 'PERCENTUAL', valor: 5 },
        },
        {
          nome: 'Acrescimo Nacional Desenvolvimento',
          prioridade: 2,
          condicoes: { operador: 'AND', regras: [
            { campo: 'regiao', operador: '==', valor: 'Nacional' },
            { campo: 'servico', operador: '==', valor: 'Desenvolvimento' },
          ]},
          acao: { tipo: 'ACRESCIMO', modo: 'PERCENTUAL', valor: 15 },
        },
        {
          nome: 'Acrescimo Faixa 51-100',
          prioridade: 3,
          condicoes: { operador: 'AND', regras: [
            { campo: 'quantidade', operador: '>=', valor: 51 },
          ]},
          acao: { tipo: 'ACRESCIMO', modo: 'PERCENTUAL', valor: 10 },
        },
      ],
    });
  }

  console.log('Seed concluído.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());