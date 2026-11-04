import type { KeyMarks } from '../game/feedback.ts'
import { DIGITS, isPower } from '../game/symbols.ts'

const POWER_LABELS: Record<string, string> = { '²': 'squared', '³': 'cubed' }

type Props = {
  operators: string[]
  marks: KeyMarks
  onTile: (tile: string) => void
  onDelete: () => void
  onSubmit: () => void
}

export function Keyboard({ operators, marks, onTile, onDelete, onSubmit }: Props) {
  const key = (tile: string, placement = '') => (
    <button
      key={tile + placement}
      type="button"
      class={`key${marks[tile] ? ` ${marks[tile]}` : ''}${placement}`}
      onClick={() => onTile(tile)}
      aria-label={POWER_LABELS[tile]}
    >
      {isPower(tile) ? (
        <>
          <span class="base">x</span>
          {tile}
        </>
      ) : (
        tile
      )}
    </button>
  )
  const powers = operators.filter(isPower)
  const binary = operators.filter((o) => !isPower(o))
  // Phones put the powers at the end of the digit rows to keep the operator row tappable.
  const rowPower = (row: number) =>
    powers.filter((_, i) => i % 2 === row).map((p) => key(p, ' narrow'))

  return (
    <div class="keyboard">
      <div class="digits">
        <div class="keys">
          {DIGITS.slice(1, 6).map((d) => key(d))}
          {rowPower(0)}
        </div>
        <div class="keys">
          {[...DIGITS.slice(6), '0'].map((d) => key(d))}
          {rowPower(1)}
        </div>
      </div>
      <div class="keys">
        {binary.map((o) => key(o))}
        {powers.map((p) => key(p, ' wide-screen'))}
        {key('=')}
        <button type="button" class="key wide" onClick={onDelete} aria-label="Delete">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            aria-hidden="true"
          >
            <path d="M8 5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H8l-6-7z" stroke-linejoin="round" />
            <path d="M11 9l6 6M17 9l-6 6" stroke-linecap="round" />
          </svg>
        </button>
        <button type="button" class="key wide enter" onClick={onSubmit}>
          Enter
        </button>
      </div>
    </div>
  )
}
