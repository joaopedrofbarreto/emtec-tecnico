import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Categoria } from '../types';

export function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');

  async function carregar() {
    const resposta = await api.get<Categoria[]>('/categorias');
    setCategorias(resposta.data);
  }

  useEffect(() => { carregar(); }, []);

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/categorias', { codigo: Number(codigo), nome });
    setCodigo('');
    setNome('');
    carregar();
  }

    async function remover(id: string) {
    if (!confirm('Remover esta categoria?')) return;
    await api.delete(`/categorias/${id}`);
    carregar();
  }

  return (
    <div>
      <h2>Categorias</h2>
      <form onSubmit={cadastrar}>
        <input placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <button type="submit">Cadastrar</button>
      </form>
      <table>
        <thead><tr><th>Código</th><th>Nome</th><th></th></tr></thead>
        <tbody>
          {categorias.map((c) => (
            <tr key={c.id}>
              <td>{c.codigo}</td>
              <td>{c.nome}</td>
              <td><button onClick={() => remover(c.id)}>Remover</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}