import { useEffect, useState } from 'react';
import { api } from '../api';
import type { FaixaUtilizacao } from '../types';

export function FaixasPage() {
  const [faixas, setFaixas] = useState<FaixaUtilizacao[]>([]);
  const [quantidadeInicial, setQuantidadeInicial] = useState('');
  const [quantidadeFinal, setQuantidadeFinal] = useState('');
  const [acrescimo, setAcrescimo] = useState('');

  async function carregar() {
    const resposta = await api.get<FaixaUtilizacao[]>('/faixas-utilizacao');
    setFaixas(resposta.data);
  }

  useEffect(() => { carregar(); }, []);

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/faixas-utilizacao', {
      quantidadeInicial: Number(quantidadeInicial),
      quantidadeFinal: quantidadeFinal ? Number(quantidadeFinal) : null,
      acrescimo: Number(acrescimo),
    });
    setQuantidadeInicial('');
    setQuantidadeFinal('');
    setAcrescimo('');
    carregar();
  }

  async function remover(id: number) {
    if (!confirm('Remover esta faixa de utilização?')) return;
    await api.delete(`/faixas-utilizacao/${id}`);
    carregar();
  }

  return (
    <div>
      <h2>Faixas de Utilização</h2>
      <form onSubmit={cadastrar}>
        <input placeholder="Quantidade Inicial" value={quantidadeInicial} onChange={(e) => setQuantidadeInicial(e.target.value)} required />
        <input placeholder="Qtd. Final (vazio = sem limite)" value={quantidadeFinal} onChange={(e) => setQuantidadeFinal(e.target.value)} style={{ width: 220 }} />
        <input placeholder="Acréscimo (%)" value={acrescimo} onChange={(e) => setAcrescimo(e.target.value)} required />
        <button type="submit">Cadastrar</button>
      </form>
      <table>
        <thead><tr><th>De</th><th>Até</th><th>Acréscimo</th><th></th></tr></thead>
        <tbody>
          {faixas.map((f) => (
            <tr key={f.id}>
              <td>{f.quantidadeInicial}</td>
              <td>{f.quantidadeFinal ?? '—'}</td>
              <td>{f.acrescimo}%</td>
              <td><button onClick={() => remover(f.id)}>Remover</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}