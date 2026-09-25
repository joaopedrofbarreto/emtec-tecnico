export interface Servico {
  id: string;
  codigo: number;
  nome: string;
  valorBase: number;
}

export interface Categoria {
  id: string;
  codigo: number;
  nome: string;
}

export interface Regiao {
  id: string;
  codigo: number;
  nome: string;
  fatorPreco: number;
}

export interface FaixaUtilizacao {
  id: string;
  quantidadeInicial: number;
  quantidadeFinal: number | null;
  acrescimo: number;
}

export interface CondicaoSimples {
  campo: string;
  operador: '==' | '!=' | '>' | '<' | '>=' | '<=';
  valor: string | number;
}

export interface Regra {
  id: string;
  nome: string;
  prioridade: number;
  ativa: boolean;
  condicoes: { operador: 'AND' | 'OR'; regras: CondicaoSimples[] };
  acao: { tipo: 'DESCONTO' | 'ACRESCIMO'; modo: 'PERCENTUAL' | 'FIXO'; valor: number };
}

export interface ResultadoCalculo {
  id: string;
  entrada: { servicoId: string; categoriaId: string; regiaoId: string; quantidade: number };
  valorInicial: number;
  regrasAvaliadas: { regraId: string; nome: string; bateu: boolean }[];
  regrasAplicadas: { regraId: string; nome: string; tipo: string; valorAplicado: number }[];
  valorFinal: number;
}