# EMTEC — Teste Técnico: Motor de Regras de Cálculo

## Como executar

Pré-requisitos: Docker e Docker Compose instalados.

```bash
docker compose up --build
```

Aguarde os 4 serviços subirem (o backend só inicia depois que o Postgres estiver saudável, graças ao healthcheck configurado). Depois, popule os dados iniciais:

```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx tsx prisma/seed.ts
```

Acesse:
- Frontend: http://localhost:5173
- Backend (API): http://localhost:3000
- Health check da API: http://localhost:3000/health

## Arquitetura

- **Backend:** Node.js + TypeScript + Fastify + Prisma 7 (driver adapter `@prisma/adapter-pg`) + PostgreSQL
- **Frontend:** React + TypeScript + Vite
- **Persistência:** PostgreSQL para dados estruturados (serviços, categorias, regiões, faixas, regras); MongoDB para a memória de cálculo (log de execução, schema variável)
- **Identificadores:** UUID v4 em todas as entidades, gerado automaticamente pelo Prisma — evita IDs sequenciais previsíveis/adivinháveis
- **Orquestração:** Docker Compose com healthcheck no Postgres, garantindo que o backend só suba após o banco estar pronto para conexões

## Estratégia de parametrização das regras

Cada regra é armazenada com duas colunas `jsonb`: `condicoes` (árvore de condições AND/OR, avaliada recursivamente) e `acao` (tipo de desconto/acréscimo, modo percentual/fixo, valor). Um motor genérico (`src/motor/avaliarCondicao.ts`) percorre essa árvore comparando campos do contexto de cálculo — nenhuma regra de negócio está hardcoded no código-fonte.

Comparações de texto são normalizadas (case-insensitive, ignorando espaços nas extremidades) para reduzir falhas por digitação nas condições cadastradas.

Novas regras e condições podem ser adicionadas via API/interface sem alteração de código, e alterações em regras existentes (via `PUT /regras/:id`, exposto na interface como "Editar") têm efeito imediato nos cálculos seguintes, sem reinício da aplicação — validado inclusive em ambiente Docker Compose.

## Funcionamento do cálculo

1. Valor inicial = `valorBase` do serviço × `fatorPreco` da região
2. Regras ativas são buscadas, ordenadas por `prioridade`
3. Cada regra é avaliada contra o contexto (categoria, região, serviço, quantidade)
4. Regras que baterem têm sua ação aplicada sequencialmente sobre o valor corrente
5. O resultado completo (valor inicial, regras avaliadas, regras aplicadas, valor final) é gravado como memória de cálculo no MongoDB e retornado na resposta

## Modelo de dados

**PostgreSQL:**
- `Servico` — código, nome, valor base
- `Categoria` — código, nome
- `Regiao` — código, nome, fator de preço
- `FaixaUtilizacao` — quantidade inicial, quantidade final (opcional), acréscimo
- `Regra` — nome, prioridade, ativa, condições (JSON), ação (JSON)

Todas as chaves primárias são UUID; `codigo` é usado como identificador de negócio único onde aplicável.

**MongoDB:**
- `memoria_calculo` — um documento por execução de cálculo, contendo entrada, valor inicial, regras avaliadas, regras aplicadas e valor final

## Decisões técnicas

- **IDs UUID** em vez de sequenciais — evita previsibilidade/enumeração de recursos
- **Prisma 7 com driver adapters** (`@prisma/adapter-pg`) em vez do driver nativo — reduz dependência de binários no container
- **Execução via `tsx`** também em produção (sem etapa de build separada) — prioriza simplicidade dado o prazo do desafio
- **Poliglota persistence:** Postgres para configuração relacional (integridade referencial importa), Mongo para log de execução (schema variável, append-only)
- **Fator de região aplicado diretamente no valor base**, separado do motor de regras condicionais — reflete a natureza fixa dessa tarifa (seção 3 do edital) versus a natureza dinâmica das regras (seção 4)
- **Healthcheck no Postgres** via `pg_isready`, com o backend configurado para aguardar o banco ficar saudável antes de iniciar — evita falhas de inicialização por corrida entre containers

## Possibilidades de evolução

- Construtor de condições no frontend hoje suporta um nível de agrupamento (AND/OR); o backend já suporta aninhamento completo de grupos
- Autenticação/autorização de usuários e controle de permissões por operação (não implementado, fora do escopo mínimo pedido)
- Comparação de condições por ID de referência em vez de nome textual, eliminando qualquer sensibilidade a digitação/acentuação
- Etapa de build (`tsc`) separada da execução, para uma imagem Docker mais enxuta em produção