# PokeSuggest ⚡

**PokeSuggest** is a tactical Pokémon team recommender built with React, TanStack Start, and Tailwind CSS. It helps players determine the best 3 Pokémon from their custom team to counter an opponent's team based on type effectiveness.

---

## 🚀 Key Features

- **Custom Team Modeler**: Configure names, primary/secondary types, and a 4-move typing profile for your 6 Pokémon team.
- **Opponent Team Parser**: Define the types of up to 6 opponent Pokémon.
- **Top 3 Recommendations**: A real-time scoring engine immediately calculates and ranks the top 3 best matchups from your team.
- **Persistence**: Auto-saves your custom team to `localStorage` so you never lose your progress on page reload.
- **Modern UI/UX**: Premium aesthetic featuring custom type icons, color-coded badges, and fully responsive layout (optimized for both mobile and desktop screens).

---

## 📊 How the Scoring Engine Works

The recommendations are calculated per-Pokémon using type matchups defined in `src/lib/pokemon.ts`:

1. **Offensive Score (+1 per match)**: For each of your Pokémon's selected move types, `+1` point is awarded for each enemy type that is weak to it (Super Effective).
2. **Defensive Score (-1 per match)**: For each of your Pokémon's types (Primary & Secondary), `-1` point is deducted for each enemy type it is weak to.
3. **Ranking**: The final score is the sum of these metrics. Only Pokémon with at least a primary type configured are ranked, with the top 3 displayed dynamically.

---

## 🛠️ Tech Stack

- **Core Framework**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Routing, Hydration, & Server**: [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (incorporating TanStack Router, TanStack Query, and Vinxi/Nitro)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [Radix UI Primitives](https://www.radix-ui.com/) & [lucide-react](https://lucide.dev/) (Shadcn-style)
- **Package Manager / Runner**: [Bun](https://bun.sh/)
- **Bundler**: [Vite 8](https://vite.dev/)

---

## 📂 Repository Structure

- `src/routes/`: File-based routes.
  - `__root.tsx`: The layout shell providing the `QueryClientProvider` and root HTML.
  - `index.tsx`: The main user interface page.
- `src/components/`: Reusable components (including custom type-specific selectors and Shadcn UI primitives).
- `src/lib/`: Custom helpers, error capture systems, and game logic data (`pokemon.ts`).
- `src/assets/`: Graphical type icons.
- `src/styles.css`: CSS styles, including custom design system variables using `oklch()`.

---

## ⚙️ Setup & Development

### 1. Installation

Install the project dependencies using Bun:

```bash
bun install
```

### 2. Run Development Server

Start the local server. The TanStack file router will compile automatically:

```bash
bun run dev
```

Open `http://localhost:3000` to preview the application.

### 3. Build & Preview

Build the production bundle (builds with Nitro for Cloudflare by default):

```bash
bun run build
bun run preview
```
