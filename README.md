# Memory Card Game

A browser-based memory card game built with TypeScript, SCSS and Vite.

## Features

- Two themes: **Code Vibes** and **Gaming**
- Three board sizes: 4×4 (16 cards), 4×6 (24 cards), 6×6 (36 cards)
- Two-player mode with turn-based switching
- Score tracking per player
- Win, draw and game-over screens
- Animated dialogs and card flip transitions

## Tech Stack

- **TypeScript** — game logic
- **SCSS** (7-1 architecture, BEM) — styling
- **Vite** — build tool and dev server

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── data.ts           # Card image datasets per theme
├── state.ts          # Shared mutable game state
├── game.ts           # Card, match and end-game logic
├── main.ts           # Settings, UI, theme and app init
└── styles/
    ├── abstract/     # Variables and mixins
    ├── base/         # Reset and typography
    ├── components/   # Card, dialog styles
    └── pages/        # Home, settings, game, game-over screens

## License

[MIT](LICENSE)
