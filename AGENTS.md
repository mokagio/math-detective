# Math Detective

A Nerdle-style equation guessing game with configurable puzzles and unlimited games.
Scope, decisions, and their rationale live in [`SCOPE.md`](SCOPE.md); read it before changing behaviour, and record new decisions there.

Personal project: work directly on `main`.

## Stack

Vite + TypeScript + Preact, deployed as a static site to Spacefast.
Game logic (parse, evaluate, validate, feedback) and the offline puzzle-generator script are plain TypeScript, separate from the UI, tested with Vitest.

## Commands

- `npm install`
- `npm run dev` — local dev server.
- `npm test` — Vitest, single run.
- `npm run build` — type-check and build to `dist/`.
- `npm run generate` — regenerate `src/puzzles/*.json` from the presets; commit the output.
- `npm run format` — Prettier; Markdown is excluded to keep semantic line breaks.
