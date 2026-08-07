# ⚔️ ARCH ARK — Evolua na Vida Real

> **O sistema de Solo Leveling para a vida real.** Transforme exercícios, estudos e hábitos em XP, itens e evolução de personagem.

**ARCH ARK** é um jogo de gamificação de hábitos inspirado em *Solo Leveling*: cada atividade real — treinar, estudar, meditar, beber água — vira uma missão que rende **XP**, **ouro** e **atributos** para o seu personagem. Evolua de rank E até **Legendary**, enfrente **masmorras** e **bosses**, equipe **itens** e conte com o assistente de IA **Ark** para guiar sua evolução.

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
| 🤖 **Ark AI** | Assistente que analisa seu desempenho, alerta sobre inatividade e recomenda treinos |
| 🔥 **Streak** | Sequência de dias consecutivos de atividade, com bônus de XP progressivos |

---

## 🏗️ Arquitetura

Monorepo com **npm workspaces** e três pacotes:

```
/
├── apps/
│   ├── web/       → Next.js 16 (App Router) — Tailwind v4, Radix UI, Framer Motion
│   └── mobile/    → Expo SDK 53 (Expo Router) — NativeWind v4, React Native 0.79
├── packages/
│   └── shared/    → TypeScript puro — tipos, lógica de jogo, store helpers
└── package.json   → workspace root (legacy-peer-deps via .npmrc)
```

### Regras de import

- **Lógica de negócio** (tipos, lib, lógica de store) → sempre em `packages/shared`
- `apps/web/src/lib/*` e `apps/web/src/types/*` são **re-exports** de `@arch-ark/shared` — não edite diretamente
- O store do mobile usa **AsyncStorage**; o web usa **localStorage** (Zustand default) — ambos gerados pela mesma factory `createGameStore()` do shared
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

## 🚀 Como rodar

### Pré-requisitos

- Node.js 18+ (recomendado: 20+)
- npm 9+

### Instalação

```bash
# instalar dependências (uma vez)
npm install
```

### Web

```bash
npm run web
# ou: cd apps/web && npx next dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Mobile

```bash
cd apps/mobile && npx expo start
# pressione 'a' (Android), 'i' (iOS) ou escaneie o QR code com o Expo Go
```

### Build de produção

```bash
npm run build:web   # build otimizado do web
```

---

## 🗺️ Rotas / Telas

### Web (`apps/web/src/app/`)

| Rota | Descrição |
|------|-----------|
| `/` | Onboarding (criação do personagem) |
| `/dashboard` | Visão geral do personagem e missões |
| `/missions` | Missões diárias, semanais e mensais |
| `/dungeons` | Masmorras e bosses |
| `/ark` | Chat com o assistente de IA Ark |
| `/inventory` | Inventário e equipamento |
| `/achievements` | Conquistas desbloqueadas |
| `/character` | Detalhes do personagem e atributos |
| `/ranking` | Ranking de jogadores |

### Mobile (`apps/mobile/app/`)

| Tela | Descrição |
|------|-----------|
| `onboarding` | Criação do personagem |
| `(tabs)/index` | Home |
| `(tabs)/missions` | Missões |
| `(tabs)/dungeons` | Masmorras |
| `(tabs)/character` | Personagem |
| `(tabs)/achievements` | Conquistas |
| `ark` | Chat com a IA Ark (modal) |

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
- **`store/createGameStore.ts`** — factory do store Zustand com persistência configurável

---

## 📚 Aprenda mais

- [Next.js Documentation](https://nextjs.org/docs) — documentação do Next.js
- [Expo Documentation](https://docs.expo.dev) — documentação do Expo
- [Solo Leveling](https://en.wikipedia.org/wiki/Solo_Leveling) — a inspiração por trás do jogo

---

## 📄 Licença

Privado — todos os direitos reservados.
