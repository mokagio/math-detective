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
          ⌫
        </button>
        <button type="button" class="key wide enter" onClick={onSubmit}>
          Enter
        </button>
      </div>
    </div>
  )
}
