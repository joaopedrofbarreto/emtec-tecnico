import { prisma } from '../db/prisma.js';
import { avaliarCondicao } from './avaliarCondicao.js';

interface EntradaCalculo {
  servicoId: number;
  categoriaId: number;
  regiaoId: number;
  quantidade: number;
}

export async function executarCalculo(entrada: EntradaCalculo) {
  const [servico, categoria, regiao, regras] = await Promise.all([
    prisma.servico.findUniqueOrThrow({ where: { id: entrada.servicoId } }),
    prisma.categoria.findUniqueOrThrow({ where: { id: entrada.categoriaId } }),
    prisma.regiao.findUniqueOrThrow({ where: { id: entrada.regiaoId } }),
    prisma.regra.findMany({ where: { ativa: true }, orderBy: { prioridade: 'asc' } }),
  ]);

  const valorInicial = Number(servico.valorBase) * Number(regiao.fatorPreco);
  let valorAtual = valorInicial;

  const contexto = {
    servico: servico.nome,
    categoriaCliente: categoria.nome,
    regiao: regiao.nome,
    quantidade: entrada.quantidade,
  };

  const regrasAvaliadas: any[] = [];
  const regrasAplicadas: any[] = [];

  for (const regra of regras) {
    const bateu = avaliarCondicao(regra.condicoes as any, contexto);
    regrasAvaliadas.push({ regraId: regra.id, nome: regra.nome, bateu });

    if (bateu) {
      const acao = regra.acao as any;
      const delta = acao.modo === 'PERCENTUAL' ? valorAtual * (acao.valor / 100) : acao.valor;
      valorAtual = acao.tipo === 'DESCONTO' ? valorAtual - delta : valorAtual + delta;

      regrasAplicadas.push({
        regraId: regra.id,
        nome: regra.nome,
        tipo: acao.tipo,
        percentual: acao.modo === 'PERCENTUAL' ? acao.valor : null,
        valorAplicado: delta,
      });
    }
  }

  return {
    entrada,
    valorInicial,
    regrasAvaliadas,
    regrasAplicadas,
    valorFinal: valorAtual,
  };
}