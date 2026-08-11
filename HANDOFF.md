# HANDOFF — ARCH ARK

> Contexto para continuar o trabalho numa sessão nova do Claude Code (terminal).
> Gerado em 2026-08-10. Estado do repo neste momento: `main` = `c12ffdc`.

---

## 1. O que é

Jogo de gamificação de hábitos inspirado em *Solo Leveling*. Atividades reais
(treinar, estudar, meditar) viram missões que rendem XP, ouro e atributos.
Web app único, responsivo, instalável como PWA — cobre desktop e mobile.

- **Repo:** `Kaua-KGzin/ARCH-ARK` (público)
- **Produção:** https://arch-ark-web.vercel.app — deploy automático a cada push na `main`
- **Vercel:** projeto `arch-ark-web` (`prj_z5FcNiq2QznnM6qVyPOfJC11mVLk`)
- **Supabase:** projeto `simple-arch` (ref `bqqadualcxlhjexkzbsn`, região `sa-east-1`)

---

## 2. O que foi feito nesta rodada

O app foi **reformulado do zero na base técnica**. Antes era Firebase/Firestore
com um bug crônico de loading infinito (~15 commits de debug sem solução). Agora:

| Área | Antes | Agora |
|------|-------|-------|
| Auth + dados | Firebase / Firestore | Supabase (Postgres + Auth) |
| Gate de rotas | Client-side (`useEffect` + listener) | **Servidor** (`proxy.ts`) |
| Plataformas | Next.js web + Expo mobile nativo | Só Next.js responsivo + PWA |
| Ranking | Dados mockados (personagens do anime) | Leaderboard real via RPC |

Também entraram: página `/settings` (3 temas, som, missões compactas), `/stats`
(gráficos com recharts), efeitos sonoros sintetizados via Web Audio, transições
entre páginas, e a **remoção da Galeria IA** (a pedido).

---

## 3. Decisões de arquitetura — leia antes de mexer

### 3.1. O gate de auth roda no servidor. Não mova pro cliente.

`apps/web/src/proxy.ts` (convenção do Next 16 para o antigo `middleware.ts`)
resolve sessão + existência de personagem em **toda** requisição, antes de
qualquer render, e decide entre `/auth`, `/onboarding` e a página pedida.

Isso é o que eliminou o loading infinito do fluxo antigo: não existe mais
spinner client-side disputando estado com um listener assíncrono. **Se alguém
reintroduzir um "loading gate" no cliente, o bug volta.**

`app/layout.tsx` (Server Component) busca `user` + `character` e hidrata o
Zustand antes do primeiro render. `GameSyncProvider` salva de volta com debounce.

### 3.2. Modelo de dados: colunas granulares + um blob

Tabela `characters` tem colunas soltas (level, xp, rank, atributos…) porque o
leaderboard e queries futuras precisam delas. **Todo o resto** do estado do jogo
(missões, inventário, conquistas, masmorras, skills, títulos, `xpHistory`) vive
em `game_data jsonb`, com a mesma forma que o Zustand já persistia. Isso deixou
a migração direta e de baixo risco.

Mapeamento em `apps/web/src/lib/supabase/game-sync.ts` — se adicionar campo novo
ao `GameState`, tem que incluir em **três** lugares:
`GameDataBlob` (type), `stateToRow()` e `partialize()` do store.

### 3.3. Lógica de jogo é pura e fica em `packages/shared`

`apps/web/src/lib/*` e `apps/web/src/types/*` são **re-exports** — não edite
esses diretamente. Regras de XP, missões, conquistas, skills e títulos ficam em
`packages/shared/src/`.

---

## 4. Bugs corrigidos que valem conhecer (pra não reintroduzir)

**a) Missões de dungeon/boss não completavam.** `MissionCard` sempre chamava
`completeMission`, que só procura em `state.missions` — mas missões de masmorra
vivem aninhadas em `dungeon.missions` / `boss.missions`. Hoje o componente aceita
um `onComplete` opcional e os callers passam `completeDungeonMission` /
`completeBossMission`. Era bug pré-existente, anterior à reformulação.

**b) Login com Google voltava pra tela inicial.** O gate rodava em
`/auth/callback` e essa rota não estava na lista de públicas. Quando o Google
devolvia o usuário com `?code=...`, a sessão **ainda não existe** — criá-la é
justamente o trabalho daquele handler. O gate lia "sem sessão em rota protegida"
e redirecionava pra `/auth` antes do handler rodar. Hoje `/auth/callback` retorna
cedo, antes de qualquer verificação. **Regra: qualquer rota que cria sessão tem
que escapar do gate.**

---

## 5. PENDENTE — Login com Google não funciona ainda

O provider está ligado no Supabase, mas **sem credenciais**. Dois passos, ambos
manuais no navegador:

### 5.1. Google Cloud Console — gerar credenciais

`APIs e Serviços` → `Credenciais` → *Criar credenciais* → **ID do cliente OAuth**
→ tipo **Aplicativo da Web**.

- **URIs de redirecionamento autorizados:**
  `https://bqqadualcxlhjexkzbsn.supabase.co/auth/v1/callback`
- **Origens JavaScript autorizadas:** `https://arch-ark-web.vercel.app`

Copie **Client ID** e **Client Secret** → cole em Supabase → `Authentication` →
`Providers` → `Google`.

Pode ser necessário configurar a tela de consentimento OAuth antes (modo
*Testing* com seu e-mail nos usuários de teste basta).

### 5.2. Supabase — liberar a URL de volta ⚠️

`Authentication` → `URL Configuration`:

- **Site URL:** `https://arch-ark-web.vercel.app`
- **Redirect URLs:** `https://arch-ark-web.vercel.app/**` e `http://localhost:3000/**`

Sem isso o Supabase bloqueia a volta pro app e o usuário cai em `/auth` sem erro.

### Como diagnosticar se ainda falhar

Olhe a query string ao ser jogado de volta em `/auth`:

- `?error=oauth` → o handler **rodou** e a troca de código falhou → problema de
  config (credenciais ou redirect URLs)
- `?next=/auth/callback` → o gate interceptou → regressão do bug 4b
- sem query string → provavelmente o Supabase redirecionou pra Site URL por a
  Redirect URL não estar na allowlist

---

## 6. Rodar localmente

```bash
git clone https://github.com/Kaua-KGzin/ARCH-ARK.git
cd ARCH-ARK
npm install
cp apps/web/.env.example apps/web/.env.local
# preencher NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev            # http://localhost:3000
```

Scripts na raiz: `npm run dev` | `npm run build` | `npm run lint`

**Env vars** (pegar em Supabase → Settings → API):

| Var | Onde | Obrigatória |
|-----|------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bqqadualcxlhjexkzbsn.supabase.co` | sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | publishable key do dashboard | sim |
| `GEMINI_API_KEY` | aistudio.google.com/apikey | não (Ark cai em modo local) |
| `GEMINI_MODEL` | default `gemini-2.5-flash` | não |

As duas primeiras **já estão configuradas na Vercel** (produção funcionando).

---

## 7. Schema do banco

Migrations `001`–`007` já aplicadas. As anteriores a `001` (`init_simple_arch`,
`task_*`, etc.) são de um **app antigo não relacionado** que ocupava esse projeto
Supabase; as tabelas dele foram removidas na `002`.

- **`profiles`** — espelha `auth.users`, criado por trigger no signup
- **`characters`** — 1:1 com usuário; colunas granulares + `game_data jsonb`
- **`ark_messages`** — histórico do chat com a IA
- **`get_leaderboard(limit_count)`** — RPC `security definer`, expõe só colunas
  não sensíveis; `execute` revogado de `anon`, concedido a `authenticated`

RLS ativo em todas as tabelas, política por `auth.uid()`.

---

## 8. Limitações do que foi verificado

Sendo explícito pra não passar confiança falsa:

- ✅ Verificado: build, typecheck, lint (zero erros/warnings), gate de rotas via
  curl, temas via screenshot, deploy de produção READY servindo o commit certo
- ❌ **Não verificado: nenhum fluxo real contra o Supabase** — signup, login,
  criação de personagem, save/load de progresso, leaderboard. A política de rede
  do ambiente onde isso foi desenvolvido bloqueia `*.supabase.co`, então o
  round-trip real nunca foi exercitado de ponta a ponta.

**Primeira coisa a fazer numa sessão nova:** criar uma conta de teste em produção
e percorrer o caminho completo — cadastro → onboarding → completar uma missão →
recarregar a página e confirmar que o progresso persistiu.

---

## 9. Ideias de próximos passos

- Testar o golden path end-to-end (item 8) — **prioridade**
- Terminar a config do Google OAuth (item 5)
- Testes automatizados: não existe nenhum. `packages/shared` é lógica pura,
  ideal pra testes unitários (xp, missions, achievements)
- `xpHistory` está capado em 200 entradas; se virar limitação, migrar pra tabela
  própria
- Realtime do Supabase está disponível mas não é usado desde que a galeria saiu
- `apps/web/src/app/loja/page.tsx` e `/skills` não foram revisados nesta rodada

---

## 10. Convenções

- Commits em inglês no título, corpo em português explicando o **porquê**
- Deploy é automático no push pra `main` — build passando localmente antes
- `.npmrc` tem `legacy-peer-deps=true` (necessário pro workspace)
- Se o `npm install` der erro de módulo não encontrado no build, apague
  `node_modules` + `package-lock.json` e reinstale: o hoisting do npm workspaces
  já quebrou uma vez neste projeto
