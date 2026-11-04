import { describe, expect, it } from 'vitest'
import { evaluate } from '../src/game/evaluate.ts'
import { parseEquation, parseExpression } from '../src/game/parse.ts'
import { checkGuess } from '../src/game/validate.ts'

const value = (source: string, bounds?: { min: number; max: number }) => {
  const expression = parseExpression(source)
  if (!expression) throw new Error(`unparseable: ${source}`)
  return evaluate(expression, bounds)
}

describe('parsing', () => {
  it.each(['07+1', '1+07', '00'])('rejects leading zeros: %s', (source) => {
    expect(parseExpression(source)).toBeNull()
  })

  it.each(['+1', '1+', '1++2', '²', '1²²', '1²3', ''])('rejects malformed: %s', (source) => {
    expect(parseExpression(source)).toBeNull()
  })

  it('accepts a lone zero as a number', () => {
    expect(parseExpression('10-0')).not.toBeNull()
  })

  it.each(['1+2', '1=2=3', '=3'])('needs exactly one "=" with both sides: %s', (source) => {
    expect(parseEquation(source)).toBeNull()
  })
})

describe('evaluation', () => {
  it('applies × and ÷ before + and -', () => {
    expect(value('2+3×4')).toBe(14)
    expect(value('20-12÷4')).toBe(17)
  })

  it('applies powers before ×', () => {
    expect(value('2×3²')).toBe(18)
    expect(value('2³-5')).toBe(3)
  })

  it('works left to right within a precedence level', () => {
    expect(value('9-3+2')).toBe(8)
    expect(value('12÷3×2')).toBe(8)
  })

  it('rejects division that is not exact', () => {
    expect(value('7÷2')).toBeNull()
    expect(value('7÷0')).toBeNull()
  })

  it('allows negative intermediates without bounds', () => {
    expect(value('3-5+9')).toBe(7)
  })

  it('applies bounds to every intermediate value', () => {
    const bounds = { min: 0, max: 20 }
    expect(value('3-5+9', bounds)).toBeNull()
    expect(value('15-9+3', bounds)).toBe(9)
    expect(value('25-10', bounds)).toBeNull()
    expect(value('5²-9', bounds)).toBeNull()
    expect(value('7×3-5', bounds)).toBeNull()
  })
})

describe('guess validation', () => {
  it('accepts any true equation of the right length', () => {
    expect(checkGuess('7+8=15', 6)).toEqual({ valid: true })
    expect(checkGuess('15=7+8', 6)).toEqual({ valid: true })
    expect(checkGuess('3+4=9-2', 7)).toEqual({ valid: true })
  })

  it('explains why a guess is rejected', () => {
    expect(checkGuess('7+8=1', 6)).toEqual({ valid: false, reason: 'incomplete' })
    expect(checkGuess('7+8+15', 6)).toEqual({ valid: false, reason: 'malformed' })
    expect(checkGuess('7÷2=3', 5)).toEqual({ valid: false, reason: 'inexact' })
    expect(checkGuess('7+8=16', 6)).toEqual({ valid: false, reason: 'untrue' })
  })
})
