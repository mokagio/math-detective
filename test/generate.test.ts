import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { evaluate } from '../src/game/evaluate.ts'
import { generate, isTrivial, operatorCount } from '../src/game/generate.ts'
import { parseEquation, parseExpression } from '../src/game/parse.ts'
import { PRESETS } from '../src/game/presets.ts'
import { DIGITS } from '../src/game/symbols.ts'

const trivial = (source: string) => isTrivial(parseExpression(source)!)

describe('triviality', () => {
  it.each(['12+0', '0+12', '12-0', '5×0', '7×0+3', '0÷4+9', '1×8', '9÷1', '7-7', '1²+3', '0³+5'])(
    'flags %s',
    (source) => expect(trivial(source)).toBe(true),
  )

  it.each(['10+23', '20-13', '12-3×4', '15-9-6', '2³-5', '10-1', '7-7×2'])('allows %s', (source) =>
    expect(trivial(source)).toBe(false),
  )
})

const loadPuzzles = (id: string): string[] =>
  JSON.parse(readFileSync(join(import.meta.dirname, '..', 'src', 'puzzles', `${id}.json`), 'utf8'))

describe.each(PRESETS)('$name puzzle list', (preset) => {
  const puzzles = loadPuzzles(preset.id)
  const allowed = new Set<string>([...DIGITS, ...preset.operators, '='])

  it('is up to date with the generator', () => {
    expect(puzzles).toEqual(generate(preset))
  })

  it('holds only equations that fit the preset', () => {
    for (const puzzle of puzzles) {
      expect(puzzle).toHaveLength(preset.tiles)
      expect(
        [...puzzle].every((c) => allowed.has(c)),
        puzzle,
      ).toBe(true)

      const equation = parseEquation(puzzle)!
      const answerFirst = equation.left.ops.length === 0 && operatorCount(equation.left) === 0
      if (preset.answerSide === 'right') expect(answerFirst, puzzle).toBe(false)
      const expression = answerFirst ? equation.right : equation.left
      const answer = answerFirst ? equation.left : equation.right
      expect(operatorCount(answer), puzzle).toBe(0)

      const n = operatorCount(expression)
      expect(n >= preset.operatorCount.min && n <= preset.operatorCount.max, puzzle).toBe(true)
      expect(isTrivial(expression), puzzle).toBe(false)
      expect(evaluate(expression, preset.range), puzzle).toBe(answer.terms[0].value)
    }
  })
})

describe('puzzle counts', () => {
  it.each([
    ['little-5', 72],
    ['little-6', 90],
    ['little-7', 3060],
  ])('%s has %i puzzles', (id, count) => {
    expect(loadPuzzles(id)).toHaveLength(count)
  })
})
