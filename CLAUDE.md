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

---

## STATUS: Refatoração de Autenticação (2026-08-07) — INFINITE LOADING DEBUG

### Último Commit
- **0b3aa87**: `fix: inline Firestore load in AuthProvider to stop reinitialization loop`
- **b4643bf**: `debug: add comprehensive logging and safety timeout to AuthProvider`

### Problemas Resolvidos ✅
1. **Firebase re-initialization loop (Commit 21916f4)**: Adicionado `_initialized` flag em `firebase.ts` para evitar múltiplas inicializações
2. **Infinite loading #1 (Commit 13008d9)**: Removido `loadGameStateFromFirestore` do dependency array do useEffect em `AuthProvider`
3. **Hook dependency loop (Current)**: Inlinado todo o código de Firestore load direto em `AuthProvider` para eliminar criar funções novas a cada render

### PROBLEMA ATUAL: Infinite Loading Spinner Persiste ⚠️
**Sintoma**: 
- Página carrega com spinner girando infinitamente
- Console mostra `[Firebase] Initialized successfully` (uma vez, sem repetição — bom)
- Mas nenhum usuário é carregado, tela fica presa no loading

**Hipóteses a investigar**:
1. `onAuthStateChanged` listener nunca dispara
2. Listener dispara mas `getDoc()` fica pendente/travado
3. Problema de configuração de variáveis de ambiente do Firebase

**Última ação**: Adicionado logging detalhado e timeout de segurança de 5s. Esperando output do console do usuário para ver qual log aparece.

### Arquivos Críticos de Autenticação
```
apps/web/src/
├── components/providers/AuthProvider.tsx    ← SINGLE SOURCE OF TRUTH
├── lib/firebase.ts                          ← Lazy initialization, sem Proxy
├── lib/auth-actions.ts                      ← Consolidado: signInWithEmail/Google
├── hooks/
│   ├── useAuth.ts                           ← Context consumer
│   ├── useRequireAuth.ts                    ← Gate hook (auth + onboarded)
│   ├── useFirestoreLoad.ts                  ← [REMOVIDO] agora inline em AuthProvider
│   └── useFirestoreAutosave.ts              ← Debounced save (3s delay, 10s min interval)
├── app/
│   ├── page.tsx                             ← Gate puro (redireciona baseado em auth/onboarded)
│   ├── auth/page.tsx                        ← Landing + login/register form (integrated)
│   ├── onboarding/page.tsx                  ← Character creation
│   ├── profile/page.tsx                     ← User settings + logout
│   ├── layout.tsx                           ← Monta AuthProvider com <Toaster/>
│   └── error.tsx, global-error.tsx          ← Error boundaries
└── components/layout/GameLayout.tsx         ← Chama useRequireAuth() + useRankReset() + useFirestoreAutosave()
```

### Código-chave: onAuthStateChanged Listener (AuthProvider.tsx)
```typescript
const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  console.log('[Auth] Listener fired:', currentUser?.email || 'logged out')
  
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }

  setUser(currentUser)

  // On login, load game state from Firestore imperatively
  if (currentUser) {
    try {
      const db = getFirebaseDb()
      if (db) {
        console.log('[Firestore] Fetching state for user:', currentUser.uid)
        const gameStateRef = doc(db, 'users', currentUser.uid, 'game-state', 'main')
        const snap = await getDoc(gameStateRef)
        // ... estado carregado no Zustand
      }
    } catch (err) {
      console.warn('[Auth] Failed to load Firestore state:', err)
    }
  }

  setLoading(false)  // ← DEVE SER ACIONADO AQUI
})

// Safety timeout: se listener não dispara em 5s, força stop
setTimeout(() => {
  console.warn('[Auth] Listener timeout after 5s, forcing stop')
  setLoading(false)
}, 5000)
```

### Próximas Ações (quando continuar)
1. **VERIFICAR CONSOLE**: Pedir ao usuário para abrir F12, limpar console, reload página, e reportar exatamente quais logs aparecem e em que ordem
2. **Se "Listener fired" aparece**: Problema é no Firestore load (getDoc travando)
3. **Se "Listener fired" NÃO aparece**: Problema é no Firebase Auth (listener nunca registrou)
4. **Timeout acionado**: Safety mechanism funcionou, mas root cause ainda desconhecido

### Teste Manual Esperado (quando funcionar)
```
User abre http://localhost:3000
→ Vê spinner por ~1s
→ Console mostra logs de init + listener
→ Listener dispara com email/logged out
→ Página redireciona para /auth (deslogado) ou /dashboard (logado)
```
