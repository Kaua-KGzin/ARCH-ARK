# ⚔️ ARCH ARK — Evolua na Vida Real

> **O sistema de Solo Leveling para a vida real.** Transforme exercícios, estudos e hábitos em XP, itens e evolução de personagem.

**ARCH ARK** é um jogo de gamificação de hábitos inspirado em *Solo Leveling*: cada atividade real — treinar, estudar, meditar, beber água — vira uma missão que rende **XP**, **ouro** e **atributos** para o seu personagem. Evolua de rank E até **Legendary**, enfrente **masmorras** e **bosses**, equipe **itens** e conte com o assistente de IA **Ark** para guiar sua evolução.

Web app único, responsivo e instalável (PWA) — a mesma base cobre desktop e mobile.

---

## ✨ Funcionalidades

| Recurso | Descrição |
|---------|-----------|
| 🎯 **Missões** | Diárias, semanais e mensais de exercício, estudo e hábitos, com recompensas em XP e ouro |
| 📈 **XP & Level** | Curva de progressão com bônus de sequência (streak): 7 dias = +10% XP, 30 dias = +30%, 100 dias = +50% |
| 🧙 **Classes** | Guerreiro, Mago, Assassino, Monarca, Arqueiro e Curandeiro — cada uma com atributos iniciais próprios |
| 🏅 **Ranks** | E → D → C → B → A → S → SS → SSS → Monarch → Legendary |
| 💪 **Atributos** | Força, Resistência, Inteligência, Disciplina, Foco, Carisma e Vitalidade evoluem conforme suas atividades |
| ⛩️ **Masmorras & Bosses** | Missões especiais com múltiplos objetivos e chefes para derrotar |
| 🎒 **Inventário & Equipamento** | Itens colecionáveis equipáveis em slots (head, chest, gloves, legs, boots, artifact) |
| 🏆 **Conquistas** | Sistema de conquistas desbloqueadas conforme o progresso |
| 🏆 **Ranking global** | Leaderboard real entre jogadores, via RPC pública do Supabase |
| 🤖 **Ark AI** | Assistente que analisa seu desempenho, alerta sobre inatividade e recomenda treinos |
| 🔥 **Streak** | Sequência de dias consecutivos de atividade, com bônus de XP progressivos |
| 📈 **Estatísticas** | Gráficos de evolução de XP, atributos e categorias mais treinadas (recharts) |
| ⚙️ **Configurações** | Temas visuais, efeitos sonoros e modo compacto de missões |
| ✨ **Missões personalizadas** | Crie suas próprias missões manualmente ou peça ao Ark |

---

## 🏗️ Arquitetura

Monorepo com **npm workspaces**:

```
/
├── apps/
│   └── web/           → Next.js 16 (App Router) — Tailwind v4, Radix UI, Framer Motion
├── packages/
│   └── shared/        → TypeScript puro — tipos, lógica de jogo, store helpers
└── package.json       → workspace root (legacy-peer-deps via .npmrc)
```

### Backend

**Supabase** (Postgres + Auth + Realtime):

- **Auth**: e-mail/senha + Google OAuth
- **`characters`**: colunas granulares (nível, XP, rank, atributos...) para leaderboard/queries + `game_data` jsonb com o restante do estado do jogo (missões, inventário, conquistas, masmorras, skills, títulos)
- **`profiles`**, **`ark_messages`**: RLS por usuário em tudo
- **`get_leaderboard()`**: RPC pública (`security definer`) que expõe só as colunas não sensíveis do ranking

### Gate de autenticação (sem loading infinito)

O roteamento entre `/auth`, `/onboarding` e as páginas do jogo é resolvido **inteiramente no servidor**, em `apps/web/src/proxy.ts` (o antigo `middleware.ts`, renomeado conforme a convenção do Next 16). A sessão e a existência do personagem são checadas antes de qualquer render — não existe mais spinner client-side disputando estado.

O estado do jogo (Zustand, lógica pura em `packages/shared`) é hidratado a partir do servidor em `app/layout.tsx` e sincronizado de volta ao Supabase com debounce via `GameSyncProvider`.

### Regras de import

- **Lógica de negócio** (tipos, lib, lógica de store) → sempre em `packages/shared`
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
| Notificações | Sonner |
| PWA | manifest.webmanifest + service worker (cache só de assets estáticos) |

---

## 🚀 Como rodar

### Pré-requisitos

- Node.js 20+
- npm 9+
- Um projeto no [Supabase](https://supabase.com)

### Instalação

```bash
npm install
cp apps/web/.env.example apps/web/.env.local
# preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Build de produção

```bash
npm run build
```

### Deploy

Deploy automático na Vercel a cada push em `main`. Configure as env vars do Supabase no dashboard do projeto Vercel.

---

## 🗺️ Rotas

| Rota | Descrição |
|------|-----------|
| `/auth` | Login / cadastro |
| `/onboarding` | Criação do personagem |
| `/dashboard` | Visão geral do personagem e missões |
| `/missions` | Missões diárias, semanais e mensais |
| `/dungeons` | Masmorras e bosses |
| `/ark` | Chat com o assistente de IA Ark |
| `/inventory` | Inventário e equipamento |
| `/achievements` | Conquistas desbloqueadas |
| `/character` | Detalhes do personagem e atributos |
| `/skills` | Habilidades desbloqueadas |
| `/ranking` | Ranking global de jogadores |
| `/stats` | Gráficos de evolução e estatísticas |
| `/loja` | Loja de itens |
| `/settings` | Tema, som, partículas, missões compactas |
| `/profile` | Configurações de conta |

---

## 🧩 Pacotes

### `@arch-ark/shared`

Núcleo do jogo, 100% TypeScript puro:

- **`types/game.ts`** — `Character`, `Mission`, `Item`, `Dungeon`, `Boss`, `Achievement`, `Rank`, `Attributes`, `GameStats` e mais
- **`lib/xp.ts`** — recompensas de XP, ganhos de atributo, `applyXpGain`, stats secundários, bônus de streak
- **`lib/missions.ts`** — geração de missões diárias/semanais/mensais, masmorras e bosses
- **`lib/achievements.ts`** — catálogo e verificação de conquistas
- **`lib/ark-ai.ts`** — análise e respostas do assistente Ark
- **`lib/utils.ts`** — helpers de nível, rank, formatação, cores e ícones
- **`store/createGameStore.ts`** — factory do store Zustand

---

## 📚 Aprenda mais

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Solo Leveling](https://en.wikipedia.org/wiki/Solo_Leveling) — a inspiração por trás do jogo

---

## 📄 Licença

Privado — todos os direitos reservados.
