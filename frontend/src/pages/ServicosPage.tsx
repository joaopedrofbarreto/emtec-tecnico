import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Servico } from '../types';

export function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [valorBase, setValorBase] = useState('');

  async function carregar() {
    const resposta = await api.get<Servico[]>('/servicos');
    setServicos(resposta.data);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/servicos', {
      codigo: Number(codigo),
      nome,
      valorBase: Number(valorBase),
    });
    setCodigo('');
    setNome('');
    setValorBase('');
    carregar();
  }

    async function remover(id: string) {
    if (!confirm('Remover este serviço?')) return;
    await api.delete(`/servicos/${id}`);
    carregar();
  }
  

  return (
    <div>
      <h2>Serviços</h2>
      <form onSubmit={cadastrar}>
        <input placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input placeholder="Valor Base" value={valorBase} onChange={(e) => setValorBase(e.target.value)} required />
        <button type="submit">Cadastrar</button>
      </form>
      <table>
        <thead>
          <tr><th>Código</th><th>Nome</th><th>Valor Base</th></tr>
        </thead>
        <tbody>
          {servicos.map((s) => (
            <tr key={s.id}>
              <td>{s.codigo}</td>
              <td>{s.nome}</td>
              <td>R$ {Number(s.valorBase).toFixed(2)}</td>
              <td><button onClick={() => remover(s.id)}>Remover</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}