export interface Servico {
  id: number;
  codigo: number;
  nome: string;
  valorBase: number;
}

export interface Categoria {
  id: number;
  codigo: number;
  nome: string;
}

export interface Regiao {
  id: number;
  codigo: number;
  nome: string;
  fatorPreco: number;
}

export interface FaixaUtilizacao {
  id: number;
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
  id: number;
  nome: string;
  prioridade: number;
  ativa: boolean;
  condicoes: { operador: 'AND' | 'OR'; regras: CondicaoSimples[] };
  acao: { tipo: 'DESCONTO' | 'ACRESCIMO'; modo: 'PERCENTUAL' | 'FIXO'; valor: number };
}

export interface ResultadoCalculo {
  id: string;
  entrada: { servicoId: number; categoriaId: number; regiaoId: number; quantidade: number };
  valorInicial: number;
  regrasAvaliadas: { regraId: number; nome: string; bateu: boolean }[];
  regrasAplicadas: { regraId: number; nome: string; tipo: string; valorAplicado: number }[];
  valorFinal: number;
}