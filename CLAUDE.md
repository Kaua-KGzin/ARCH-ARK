<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.

---

## Arquitetura do Projeto

**Monorepo npm workspaces** — um único web app (responsivo, cobre mobile e desktop):

```
/
├── apps/
│   └── web/       → Next.js 16 (App Router) — Tailwind v4, Radix UI, Framer Motion
├── packages/
│   └── shared/    → TypeScript puro — tipos, lógica de jogo, store helpers
└── package.json   → workspace root (legacy-peer-deps via .npmrc)
```

### Backend: Supabase

Auth (e-mail/senha + Google OAuth) e persistência em Postgres. Tabelas: `profiles`,
`characters` (colunas granulares + `game_data` jsonb com o resto do estado do jogo),
`ark_messages`, `gallery_images` — todas com RLS por usuário. `get_leaderboard()` é
uma RPC pública (`security definer`) que expõe só as colunas não sensíveis para o
ranking.

### Gate de autenticação — roda no servidor, não no cliente

`apps/web/src/proxy.ts` (convenção Next 16 para o antigo `middleware.ts`) resolve
sessão + existência de personagem em toda requisição, **antes** de qualquer render,
e redireciona para `/auth`, `/onboarding` ou a página pedida. Não há client-side
loading gate — isso elimina a classe de bug que causava loading infinito no fluxo
antigo baseado em Firebase (`onAuthStateChanged` + `useEffect` disputando estado).

`app/layout.tsx` (Server Component) busca `user` + `character` via
`lib/supabase/server.ts` e hidrata o Zustand store (`GameSyncProvider`) antes do
primeiro render client-side. Mudanças no store são salvas de volta ao Supabase com
debounce (`lib/supabase/game-sync.ts`).

### Como rodar

```bash
npm install
cp apps/web/.env.example apps/web/.env.local   # preencha as vars do Supabase
npm run dev
```

### Regras de import

- Lógica de negócio (types, lib, store logic) → sempre em `packages/shared`
- `apps/web/src/lib/*` e `apps/web/src/types/*` são **re-exports** de `@arch-ark/shared` — não edite diretamente
- Path alias `@arch-ark/shared` mapeado via `tsconfig.json`

### Stack principal

| Camada | Tecnologia |
|--------|-----------|
| Routing | Next.js 16 App Router |
| Styling | Tailwind CSS v4 |
| State | Zustand (hidratado/sincronizado com Supabase) |
| Backend | Supabase (Postgres, Auth, Realtime) |
| Animações | Framer Motion |
| UI primitivos | Radix UI |
| PWA | manifest.webmanifest + service worker (só cacheia assets estáticos) |
