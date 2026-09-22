type Condicao =
  | { operador: 'AND' | 'OR'; regras: Condicao[] }
  | { campo: string; operador: '==' | '!=' | '>' | '<' | '>=' | '<='; valor: string | number };

type Contexto = Record<string, string | number>;

export function avaliarCondicao(condicao: Condicao, contexto: Contexto): boolean {
  if ('regras' in condicao) {
    const resultados = condicao.regras.map((c) => avaliarCondicao(c, contexto));
    return condicao.operador === 'AND' ? resultados.every(Boolean) : resultados.some(Boolean);
  }

  const valorContexto = contexto[condicao.campo];

  switch (condicao.operador) {
    case '==': return valorContexto === condicao.valor;
    case '!=': return valorContexto !== condicao.valor;
    case '>': return valorContexto > condicao.valor;
    case '<': return valorContexto < condicao.valor;
    case '>=': return valorContexto >= condicao.valor;
    case '<=': return valorContexto <= condicao.valor;
  }
}