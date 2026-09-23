import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Regiao } from '../types';

export function RegioesPage() {
  const [regioes, setRegioes] = useState<Regiao[]>([]);
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [fatorPreco, setFatorPreco] = useState('');

  async function carregar() {
    const resposta = await api.get<Regiao[]>('/regioes');
    setRegioes(resposta.data);
  }

  useEffect(() => { carregar(); }, []);

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/regioes', { codigo: Number(codigo), nome, fatorPreco: Number(fatorPreco) });
    setCodigo('');
    setNome('');
    setFatorPreco('');
    carregar();
  }

  async function remover(id: number) {
    if (!confirm('Remover esta região?')) return;
    await api.delete(`/regioes/${id}`);
    carregar();
  }

  return (
    <div>
      <h2>Regiões</h2>
      <form onSubmit={cadastrar}>
        <input placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input placeholder="Fator de Preço" value={fatorPreco} onChange={(e) => setFatorPreco(e.target.value)} required />
        <button type="submit">Cadastrar</button>
      </form>
      <table>
        <thead><tr><th>Código</th><th>Nome</th><th>Fator</th><th></th></tr></thead>
        <tbody>
          {regioes.map((r) => (
            <tr key={r.id}>
              <td>{r.codigo}</td>
              <td>{r.nome}</td>
              <td>{r.fatorPreco}</td>
              <td><button onClick={() => remover(r.id)}>Remover</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}