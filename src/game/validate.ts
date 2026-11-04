import { evaluate } from './evaluate.ts'
import { parseEquation } from './parse.ts'

export type GuessCheck =
  { valid: true } | { valid: false; reason: 'incomplete' | 'malformed' | 'inexact' | 'untrue' }

export function checkGuess(guess: string, tiles: number): GuessCheck {
  if (guess.length !== tiles) return { valid: false, reason: 'incomplete' }
  const equation = parseEquation(guess)
  if (!equation) return { valid: false, reason: 'malformed' }
  const left = evaluate(equation.left)
  const right = evaluate(equation.right)
  if (left === null || right === null) return { valid: false, reason: 'inexact' }
  return left === right ? { valid: true } : { valid: false, reason: 'untrue' }
}
