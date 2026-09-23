import { useState } from 'react';
import { ServicosPage } from './pages/ServicosPage';
import { CategoriasPage } from './pages/CategoriasPage';
import { RegioesPage } from './pages/RegioesPage';
import { FaixasPage } from './pages/FaixasPage';
import { RegrasPage } from './pages/RegrasPage';
import { CalculoPage } from './pages/CalculoPage';

const ABAS = {
  servicos: { label: 'Serviços', componente: ServicosPage },
  categorias: { label: 'Categorias', componente: CategoriasPage },
  regioes: { label: 'Regiões', componente: RegioesPage },
  faixas: { label: 'Faixas de Utilização', componente: FaixasPage },
  regras: { label: 'Regras', componente: RegrasPage },
  calculo: { label: 'Calcular', componente: CalculoPage },
} as const;

type Aba = keyof typeof ABAS;

function App() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('servicos');
  const Componente = ABAS[abaAtiva].componente;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1>EMTEC — Motor de Regras</h1>
      <nav style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {Object.entries(ABAS).map(([chave, { label }]) => (
          <button
            key={chave}
            onClick={() => setAbaAtiva(chave as Aba)}
            style={{ fontWeight: abaAtiva === chave ? 'bold' : 'normal' }}
          >
            {label}
          </button>
        ))}
      </nav>
      <Componente />
    </div>
  );
}

export default App;