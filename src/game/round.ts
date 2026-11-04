import { mergeKeyMarks, score, type KeyMarks, type Mark } from './feedback.ts'
import { checkGuess, type GuessCheck } from './validate.ts'

export const MAX_ATTEMPTS = 6

export type Round = {
  answer: string
  guesses: { text: string; marks: Mark[] }[]
  input: string
  status: 'playing' | 'won' | 'revealed'
  keys: KeyMarks
  /** Increments on each rejected guess so the UI can replay its shake. */
  rejection: { reason: Extract<GuessCheck, { valid: false }>['reason']; count: number } | null
}

export type RoundAction = { type: 'type'; tile: string } | { type: 'delete' } | { type: 'submit' }

export const startRound = (answer: string): Round => ({
  answer,
  guesses: [],
  input: '',
  status: 'playing',
  keys: {},
  rejection: null,
})

export function roundReducer(round: Round, action: RoundAction): Round {
  if (round.status !== 'playing') return round
  const tiles = round.answer.length

  switch (action.type) {
    case 'type':
      if (round.input.length >= tiles) return round
      return { ...round, input: round.input + action.tile, rejection: null }
    case 'delete':
      return { ...round, input: round.input.slice(0, -1), rejection: null }
    case 'submit': {
      const check = checkGuess(round.input, tiles)
      if (!check.valid) {
        const count = (round.rejection?.count ?? 0) + 1
        return { ...round, rejection: { reason: check.reason, count } }
      }
      const marks = score(round.input, round.answer)
      const guesses = [...round.guesses, { text: round.input, marks }]
      const status =
        round.input === round.answer
          ? 'won'
          : guesses.length === MAX_ATTEMPTS
            ? 'revealed'
            : 'playing'
      return {
        ...round,
        guesses,
        input: '',
        status,
        keys: mergeKeyMarks(round.keys, round.input, marks),
        rejection: null,
      }
    }
  }
}
