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

**Monorepo npm workspaces** com três pacotes:

```
/
├── apps/
│   ├── web/       → Next.js 16 (App Router) — Tailwind v4, Radix UI, Framer Motion
│   └── mobile/    → Expo SDK 53 (Expo Router) — NativeWind v4, React Native 0.79
├── packages/
│   └── shared/    → TypeScript puro — tipos, lógica de jogo, store helpers
└── package.json   → workspace root (legacy-peer-deps via .npmrc)
```

### Como rodar

```bash
# instalar (uma vez)
npm install

# web
npm run web
# ou: cd apps/web && npx next dev

# mobile
cd apps/mobile && npx expo start
# pressione 'a' (Android), 'i' (iOS) ou escaneie o QR com Expo Go
```

### Regras de import

- Lógica de negócio (types, lib, store logic) → sempre em `packages/shared`
- `apps/web/src/lib/*` e `apps/web/src/types/*` são **re-exports** de `@arch-ark/shared` — não edite diretamente
- O store do mobile (`apps/mobile/store/useGameStore.ts`) usa AsyncStorage; o web usa localStorage (Zustand default)
- Path alias `@arch-ark/shared` mapeado via `tsconfig.json` em cada app

### Stack principal

| Camada | Web | Mobile |
|--------|-----|--------|
| Routing | Next.js App Router | Expo Router (file-based) |
| Styling | Tailwind CSS v4 | NativeWind v4 (Tailwind v3) |
| State | Zustand + localStorage | Zustand + AsyncStorage |
| Animações | Framer Motion | React Native Animated |
| UI primitivos | Radix UI | React Native core |
