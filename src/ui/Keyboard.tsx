import type { KeyMarks } from '../game/feedback.ts'
import { DIGITS, isPower } from '../game/symbols.ts'

type Props = {
  operators: string[]
  marks: KeyMarks
  onTile: (tile: string) => void
  onDelete: () => void
  onSubmit: () => void
}

export function Keyboard({ operators, marks, onTile, onDelete, onSubmit }: Props) {
  const key = (tile: string) => (
    <button
      key={tile}
      type="button"
      class={`key${marks[tile] ? ` ${marks[tile]}` : ''}${isPower(tile) ? ' power' : ''}`}
      onClick={() => onTile(tile)}
    >
      {tile}
    </button>
  )

  return (
    <div class="keyboard">
      <div class="keys digits">{[...DIGITS.slice(1), '0'].map(key)}</div>
      <div class="keys">
        {[...operators, '='].map(key)}
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
