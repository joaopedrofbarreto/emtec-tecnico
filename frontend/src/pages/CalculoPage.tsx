import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Servico, Categoria, Regiao, ResultadoCalculo } from '../types';

export function CalculoPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [regioes, setRegioes] = useState<Regiao[]>([]);
  const [servicoId, setServicoId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [regiaoId, setRegiaoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);

  useEffect(() => {
    api.get<Servico[]>('/servicos').then((r) => setServicos(r.data));
    api.get<Categoria[]>('/categorias').then((r) => setCategorias(r.data));
    api.get<Regiao[]>('/regioes').then((r) => setRegioes(r.data));
  }, []);

  async function calcular(e: React.FormEvent) {
    e.preventDefault();
    const resposta = await api.post<ResultadoCalculo>('/calculo', {
      servicoId: Number(servicoId),
      categoriaId: Number(categoriaId),
      regiaoId: Number(regiaoId),
      quantidade: Number(quantidade),
    });
    setResultado(resposta.data);
  }

  return (
    <div>
      <h2>Executar Cálculo</h2>
      <form onSubmit={calcular}>
        <select value={servicoId} onChange={(e) => setServicoId(e.target.value)} required>
          <option value="">Serviço</option>
          {servicos.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
        </select>
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
          <option value="">Categoria</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <select value={regiaoId} onChange={(e) => setRegiaoId(e.target.value)} required>
          <option value="">Região</option>
          {regioes.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}
        </select>
        <input placeholder="Quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
        <button type="submit">Calcular</button>
      </form>

      {resultado && (
        <div>
          <h3>Memória de Cálculo</h3>
          <p><strong>Valor Inicial:</strong> R$ {resultado.valorInicial.toFixed(2)}</p>

          <h4>Regras Avaliadas</h4>
          <ul>
            {resultado.regrasAvaliadas.map((r) => (
              <li key={r.regraId}>{r.nome} — {r.bateu ? '✅ aplicada' : '❌ não bateu'}</li>
            ))}
          </ul>

          <h4>Regras Aplicadas</h4>
          <ul>
            {resultado.regrasAplicadas.map((r) => (
              <li key={r.regraId}>{r.nome} ({r.tipo}): R$ {r.valorAplicado.toFixed(2)}</li>
            ))}
          </ul>

          <p><strong>Valor Final: R$ {resultado.valorFinal.toFixed(2)}</strong></p>
        </div>
      )}
    </div>
  );
}