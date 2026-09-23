import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Regra, CondicaoSimples } from '../types';

const CAMPOS_DISPONIVEIS = ['categoriaCliente', 'regiao', 'servico', 'quantidade'];
const OPERADORES = ['==', '!=', '>', '<', '>=', '<='] as const;

export function RegrasPage() {
  const [regras, setRegras] = useState<Regra[]>([]);
  const [nome, setNome] = useState('');
  const [prioridade, setPrioridade] = useState('1');
  const [operadorGrupo, setOperadorGrupo] = useState<'AND' | 'OR'>('AND');
  const [condicoes, setCondicoes] = useState<CondicaoSimples[]>([
    { campo: CAMPOS_DISPONIVEIS[0], operador: '==', valor: '' },
  ]);
  const [tipoAcao, setTipoAcao] = useState<'DESCONTO' | 'ACRESCIMO'>('DESCONTO');
  const [modoAcao, setModoAcao] = useState<'PERCENTUAL' | 'FIXO'>('PERCENTUAL');
  const [valorAcao, setValorAcao] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  async function carregar() {
    const resposta = await api.get<Regra[]>('/regras');
    setRegras(resposta.data);
  }

  useEffect(() => { carregar(); }, []);

  function adicionarCondicao() {
    setCondicoes([...condicoes, { campo: CAMPOS_DISPONIVEIS[0], operador: '==', valor: '' }]);
  }

  function removerCondicao(index: number) {
    setCondicoes(condicoes.filter((_, i) => i !== index));
  }

  function atualizarCondicao(index: number, campo: Partial<CondicaoSimples>) {
    setCondicoes(condicoes.map((c, i) => (i === index ? { ...c, ...campo } : c)));
  }

  function editar(regra: Regra) {
    setEditandoId(regra.id);
    setNome(regra.nome);
    setPrioridade(String(regra.prioridade));

    const condicoesRegra = regra.condicoes as any;
    if (condicoesRegra && Array.isArray(condicoesRegra.regras)) {
      // Formato de grupo (AND/OR) — o padrão criado pelo formulário
      setOperadorGrupo(condicoesRegra.operador);
      setCondicoes(condicoesRegra.regras);
    } else {
      // Formato antigo: condição única, sem agrupamento
      setOperadorGrupo('AND');
      setCondicoes([condicoesRegra]);
    }

    setTipoAcao(regra.acao.tipo);
    setModoAcao(regra.acao.modo);
    setValorAcao(String(regra.acao.valor));
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      nome,
      prioridade: Number(prioridade),
      condicoes: { operador: operadorGrupo, regras: condicoes },
      acao: { tipo: tipoAcao, modo: modoAcao, valor: Number(valorAcao) },
    };

    if (editandoId) {
      await api.put(`/regras/${editandoId}`, payload);
    } else {
      await api.post('/regras', payload);
    }

    setEditandoId(null);
    setNome('');
    setPrioridade('1');
    setCondicoes([{ campo: CAMPOS_DISPONIVEIS[0], operador: '==', valor: '' }]);
    setValorAcao('');
    carregar();
  }

  async function alternarAtiva(regra: Regra) {
    const acao = regra.ativa ? 'desativar' : 'ativar';
    await api.patch(`/regras/${regra.id}/${acao}`);
    carregar();
  }

  return (
    <div>
      <h2>Regras de Cálculo</h2>
      <form onSubmit={salvar}>
        <input placeholder="Nome da regra" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input placeholder="Prioridade" value={prioridade} onChange={(e) => setPrioridade(e.target.value)} required />

        <fieldset>
          <legend>Condições (todas combinadas com):</legend>
          <select value={operadorGrupo} onChange={(e) => setOperadorGrupo(e.target.value as 'AND' | 'OR')}>
            <option value="AND">E (todas precisam ser verdadeiras)</option>
            <option value="OR">OU (basta uma ser verdadeira)</option>
          </select>

          {condicoes.map((c, i) => (
            <div key={i}>
              <select value={c.campo} onChange={(e) => atualizarCondicao(i, { campo: e.target.value })}>
                {CAMPOS_DISPONIVEIS.map((campo) => <option key={campo} value={campo}>{campo}</option>)}
              </select>
              <select value={c.operador} onChange={(e) => atualizarCondicao(i, { operador: e.target.value as any })}>
                {OPERADORES.map((op) => <option key={op} value={op}>{op}</option>)}
              </select>
              <input
                placeholder="Valor"
                value={c.valor}
                onChange={(e) => atualizarCondicao(i, { valor: e.target.value })}
              />
              <button type="button" onClick={() => removerCondicao(i)}>Remover</button>
            </div>
          ))}
          <button type="button" onClick={adicionarCondicao}>+ Adicionar condição</button>
        </fieldset>

        <fieldset>
          <legend>Ação</legend>
          <select value={tipoAcao} onChange={(e) => setTipoAcao(e.target.value as any)}>
            <option value="DESCONTO">Desconto</option>
            <option value="ACRESCIMO">Acréscimo</option>
          </select>
          <select value={modoAcao} onChange={(e) => setModoAcao(e.target.value as any)}>
            <option value="PERCENTUAL">Percentual (%)</option>
            <option value="FIXO">Valor fixo (R$)</option>
          </select>
          <input placeholder="Valor" value={valorAcao} onChange={(e) => setValorAcao(e.target.value)} required />
        </fieldset>

        <button type="submit">{editandoId ? 'Salvar Alterações' : 'Cadastrar Regra'}</button>
      </form>

      <table>
        <thead><tr><th>Nome</th><th>Prioridade</th><th>Ativa</th><th></th></tr></thead>
        <tbody>
          {regras.map((r) => (
            <tr key={r.id}>
              <td>{r.nome}</td>
              <td>{r.prioridade}</td>
              <td>{r.ativa ? 'Sim' : 'Não'}</td>
              <td>
                <button onClick={() => editar(r)}>Editar</button>
                <button onClick={() => alternarAtiva(r)}>{r.ativa ? 'Desativar' : 'Ativar'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}