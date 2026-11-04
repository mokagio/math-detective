import { useCallback, useEffect, useReducer, useState } from 'preact/hooks'
import { PRESETS, presetById } from '../game/presets.ts'
import { roundReducer, startRound, type Round, type RoundAction } from '../game/round.ts'
import { Board } from './Board.tsx'
import { Keyboard } from './Keyboard.tsx'
import { nextPuzzle } from './puzzles.ts'

const PRESET_KEY = 'math-detective:preset'

const REJECTIONS: Record<NonNullable<Round['rejection']>['reason'], string> = {
  incomplete: 'Fill every tile',
  malformed: 'That’s not an equation',
  inexact: '÷ must divide exactly',
  untrue: 'Both sides must be equal',
}

const PHYSICAL_KEYS: Record<string, string> = { '*': '×', x: '×', '/': '÷' }

type State = { round: Round | null }
type Action = { type: 'start'; answer: string } | RoundAction

function reducer(state: State, action: Action): State {
  if (action.type === 'start') return { round: startRound(action.answer) }
  return state.round ? { round: roundReducer(state.round, action) } : state
}

export function App() {
  const [presetId, setPresetId] = useState(() => {
    const saved = localStorage.getItem(PRESET_KEY)
    return saved && presetById(saved) ? saved : PRESETS[0].id
  })
  const preset = presetById(presetId)!
  const [{ round }, dispatch] = useReducer(reducer, { round: null })

  const newPuzzle = useCallback(async () => {
    dispatch({ type: 'start', answer: await nextPuzzle(presetId) })
  }, [presetId])

  useEffect(() => {
    localStorage.setItem(PRESET_KEY, presetId)
    let current = true
    void nextPuzzle(presetId).then((answer) => current && dispatch({ type: 'start', answer }))
    return () => {
      current = false
    }
  }, [presetId])

  useEffect(() => {
    const allowed = new Set([...'0123456789', ...preset.operators, '='])
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === 'Enter') {
        if (round?.status === 'playing') dispatch({ type: 'submit' })
        else void newPuzzle()
      } else if (event.key === 'Backspace') dispatch({ type: 'delete' })
      else {
        const tile = PHYSICAL_KEYS[event.key] ?? event.key
        if (!allowed.has(tile)) return
        dispatch({ type: 'type', tile })
      }
      event.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [preset, round?.status, newPuzzle])

  return (
    <main class="app" style={{ '--tiles': preset.tiles }}>
      <header>
        <h1>Math Detective</h1>
        <select
          aria-label="Preset"
          value={presetId}
          onChange={(e) => setPresetId(e.currentTarget.value)}
        >
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </header>

      {round && (
        <>
          <section class="play">
            <Board round={round} />
            {round.status === 'won' && <div class="stamp">Solved</div>}
          </section>

          <div class="status" aria-live="polite">
            {round.status === 'playing' && round.rejection && REJECTIONS[round.rejection.reason]}
            {round.status === 'revealed' && (
              <>
                The answer was <strong class="answer">{round.answer}</strong>
              </>
            )}
          </div>

          {round.status === 'playing' ? (
            <Keyboard
              operators={preset.operators}
              marks={round.keys}
              onTile={(tile) => dispatch({ type: 'type', tile })}
              onDelete={() => dispatch({ type: 'delete' })}
              onSubmit={() => dispatch({ type: 'submit' })}
            />
          ) : (
            <div class="next">
              <button type="button" class="key enter" onClick={() => void newPuzzle()} autofocus>
                Next puzzle
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
