import type { Round } from '../game/round.ts'
import { MAX_ATTEMPTS } from '../game/round.ts'
import { isPower } from '../game/symbols.ts'

export function Board({ round }: { round: Round }) {
  const tiles = round.answer.length
  const rows = Array.from({ length: MAX_ATTEMPTS }, (_, i) => {
    const guess = round.guesses[i]
    if (guess) return { text: guess.text, marks: guess.marks, current: false }
    const current = i === round.guesses.length && round.status === 'playing'
    return { text: current ? round.input : '', marks: [], current }
  })

  return (
    <div class="board" role="grid" aria-label="Guesses">
      {rows.map((row, r) => (
        <div
          key={row.current ? `current-${round.rejection?.count ?? 0}` : r}
          class={`row${row.current && round.rejection ? ' shake' : ''}`}
          role="row"
        >
          {Array.from({ length: tiles }, (_, c) => {
            const symbol = row.text[c] ?? ''
            const mark = row.marks[c]
            return (
              <div
                key={c}
                role="gridcell"
                class={`tile${mark ? ` ${mark}` : ''}${symbol && !mark ? ' filled' : ''}${isPower(symbol) ? ' power' : ''}`}
                style={mark ? { animationDelay: `${c * 70}ms` } : undefined}
              >
                {symbol}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
