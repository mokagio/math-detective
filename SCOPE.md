# Math Detective — scope

A game inspired by Nerdle where you guess the equation, with configurable equations and unlimited games.

## Target players

- **The Little player** knows only `+` and `-`.
- **The Stretch player** knows `+ - × ÷` and is starting on `^`, roots and decimals.

## How it differs from Nerdle

- Players choose what kind of equations they get.
- Games are unlimited, with a new puzzle as soon as one is solved.
  Nerdle has one daily puzzle and fixed skill levels.

## Out of scope for now

- Accounts.
- Stats.

## After the MVP

- A custom-settings screen, with random generation in the browser (decision 10).
- Saving presets, in `localStorage`, plus a share link that encodes the settings in the URL.
- An installable app that works offline (decision 17).
- More operators: general `^`, roots and decimals (decision 8).
- Sums on both sides of the `=` (decision 2).
- Settings to accept swapped order (decision 4), allow only one kind of operator per puzzle (decision 7), and change the number of attempts (decision 13).

## Decisions

<!-- One entry per resolved question: the decision, then a line on why. -->

1. **A configuration is a tile count, a set of operators and a number range.**
   Length alone doesn't set difficulty: 6 tiles with `+ -` allows only 90 equations in two shapes, and 7 tiles allows 5,200, many with big numbers.
   The range keeps longer equations within reach of the Little player.
   Some settings will allow very few equations, or none, so the setup screen has to say so.
2. **The shape of the answer is a setting: either the answer is on the right (`7+8=15`), or it can be on either side (`15=7+8`).**
   With either side allowed, the `=` no longer sits in a predictable spot.
   Sums on both sides (`3+4=9-2`) are out for now.
3. **Any true equation with exactly one `=` is a valid guess, whatever its shape, but only an exact tile-for-tile match solves the puzzle.**
   Guessing `15=7+8` when the answer is `7+8=15` gets colour feedback, not a win.
4. **Order counts: `8+7=15` does not solve `7+8=15`.**
   This follows from decision 3, can't be gamed, and avoids having to define equivalence for `-` and `÷`.
   A setting to accept swapped order can come later without rework.
5. **The number range applies to every value: the typed numbers, the answer and the steps in between. No negative numbers anywhere in the MVP.**
   Every step stays mental-maths friendly (`3-5+9=7` is out because its middle step is `-2`).
   This also avoids a minus-sign tile that beginners could confuse with subtraction.
6. **The operator count is a setting with a minimum and a maximum.**
   At a fixed length, fewer operators means bigger numbers (`10+23=33` against `3+4-2+1=6`).
   Setting the minimum equal to the maximum fixes the shape, for example `a+b=c` for the Little player.
7. **Operators follow standard order: `×` and `÷` before `+` and `-`.**
   It's correct, and puzzles teach it.
   A "no mixed operators" setting that only affects the generator can come later if it frustrates the Stretch player.
   Defaults: no leading zeros (`07` isn't a number), and `÷` must divide exactly.
8. **The MVP operators are `+ − × ÷ ² ³`, nothing else.**
   `²` and `³` are single tiles placed after a number (`5²=25`).
   They come before `×` and `÷` in the order of operations.
   The number range limits their results too.
   General `^`, roots and decimals are post-MVP.
9. **Single player, with a responsive layout for phones and tablets.**
   There are no turns and no shared play.
   Each player uses their own device.
10. **Where puzzles come from depends on the stage.**
    - The MVP has fixed presets.
      A script I run generates each preset's full list ahead of time, filters out trivial equations, and the app ships the lists as data.
    - The custom-settings screen comes after the MVP and uses random generation in the browser, which reports "plenty" or "only N found" instead of an exact count.
    Full lists are small (about 6,500 equations is roughly 60 KB), so they aren't capped at 100.
11. **The MVP presets:**

    | Preset | Tiles | Operators | Range | Operator count | Answer | Puzzles |
    |---|---|---|---|---|---|---|
    | Little-5 | 5 | `+ -` | 0–99 | exactly 1 | right | 72 |
    | Little-6 | 6 | `+ -` | 0–99 | exactly 1 | right | 90 |
    | Little-7 | 7 | `+ -` | 0–99 | exactly 1 | right | 3,060 |
    | Classic | 8 | `+ − × ÷` | 0–99 | 1–3 | right | ≈13,400 |
    | Stretch | 8 | `+ − × ÷ ² ³` | 0–999 | 1–3 | either side | ≈28,000 |

    Each Little preset has a fixed set of possible layouts, one per row below.
    The counts are after filtering out trivial answers:
    - Little-5: `n+n=n` and `n-n=n`, 36 each.
    - Little-6: `n+n=nn` and `nn-n=n`, 45 each.
    - Little-7: `n+nn=nn`, `nn+n=nn`, `nn-n=nn` and `nn-nn=n`, 765 each.
    Offering three lengths varies them.
    Little-5 and Little-6 match Nerdle Micro and Nerdle Mini in size, but use only `+` and `-`.
    Classic and Stretch match Nerdle's 8 tiles.

12. **Hidden answers never contain trivial steps.**
    That means no `+0` or `-0`, no `×0` or `0÷`, no `×1` or `÷1`, and no `n-n`.
    Guesses may still use them.
    Zero still appears inside numbers and as an answer.
13. **Players get 6 attempts, then the answer is revealed, as in Nerdle.**
    The next puzzle is one tap away, so a loss costs little.
14. **Stretch does not force `²` or `³`.**
    They appear only as often as chance makes them.
    Revisit if they turn out too rare in play.
15. **Feedback follows the standard Wordle and Nerdle conventions.** (Proposed; the user can object.)
    - Each tile shows one of three colours: right place, in the answer but elsewhere, or not in the answer.
    - When a guess repeats a symbol, only as many of those tiles get coloured as the answer actually contains.
    - The colour scheme stays readable for colour-blind players.
    - The on-screen keyboard shows each key's best result so far, and a physical keyboard also works.
16. **The stack is Vite, TypeScript and Preact. The MVP is a static site on Spacefast; the Zero runtime isn't used.**
    The game rules (parse, evaluate, validate, colour feedback) and the puzzle-generation script are plain TypeScript, separate from the interface code, and tested with Vitest.
    A static site can move to any host as it is.
    The Zero runtime stays an option if saved presets ever need a server.
17. **The MVP isn't installable and doesn't work offline. It's a plain website.**
    An installable offline app (`vite-plugin-pwa`) is post-MVP.
    That would need an update prompt and a check on Spacefast's caching headers.
18. **The game loop is: solve or reveal, then a "Next puzzle" button.** (Proposed; the user can object.)
    The preset switcher sits in the header and starts a new puzzle when changed.
    Within a session, a preset never repeats a puzzle until its list runs out.
19. **The game is called Math Detective. The interface nods to Murdle's look, but the game is minimal.**
    The detective look is visual only: no story, no characters, no flavour text.
    Every interface choice serves gameplay first.

20. **The code lives in a public GitHub repository, `mokagio/math-detective`, with work going straight to `main`.**
    Because it's public, anyone can read the puzzle lists, just as with Nerdle.
    The first commit is this file plus an `AGENTS.md` with the build, test and publish commands.

## Findings

- **Listing every equation in the browser is too slow for wider settings.**
  A rough first-pass script was timed with Node:
  - 8 tiles, `+ -`, one operator, numbers up to 99: 6,480 equations in 13 ms.
  - 8 tiles, `+ − × ÷`, numbers up to 99: 34,510 equations in 2.4 s.
  - 8 tiles, `+ − × ÷ ² ³`, numbers up to 999: 63,829 equations in 104 s.
  - Smarter pruning would help, but the space keeps growing with longer equations and wider ranges.
- **Many generated equations are trivial**, like `7+0÷14=7`.
  Decision 12 settles which ones are filtered out.
- **Rough equation counts per preset** (the `n-n` filter and Stretch's either-side copies weren't applied yet):
  - Little (7 tiles, before Little-5 and Little-6 were added): 3,150 after filtering (3,420 before).
  - Classic: 13,409 after filtering (34,510 before).
  - Stretch: 28,031 after filtering (63,829 before), taking about 104 s to generate. That's fine for an offline script.
- **Stretch rarely includes `²` or `³`.**
  Random picks looked like Classic (`72+17=89`, `61-11=50`).
  Decision 14 leaves it to chance for now.

## Open questions

None. Scoping is done.
