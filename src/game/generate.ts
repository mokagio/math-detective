import { evaluate } from './evaluate.ts'
import type { Expression, Term } from './parse.ts'
import type { Preset } from './presets.ts'
import { isOperator, isPower, type Operator } from './symbols.ts'

const SUPERSCRIPT = { 1: '', 2: '²', 3: '³' } as const

const termText = (t: Term) => `${t.value}${SUPERSCRIPT[t.exponent]}`

export const expressionText = ({ terms, ops }: Expression) =>
  terms.map((t, i) => (i === 0 ? '' : ops[i - 1]) + termText(t)).join('')

export const operatorCount = ({ terms, ops }: Expression) =>
  ops.length + terms.filter((t) => t.exponent > 1).length

/**
 * Trivial steps make dull answers: adding or subtracting 0, `×0`, `0÷`, `×1`, `÷1`, `1×`,
 * `n-n`, and powers of 0 or 1.
 */
export function isTrivial({ terms, ops }: Expression): boolean {
  if (terms.some((t) => t.exponent > 1 && t.value <= 1)) return true
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i]
    const [a, b] = [terms[i], terms[i + 1]]
    if (op === '+' || op === '-') {
      const leftStandsAlone = i === 0 || ops[i - 1] === '+' || ops[i - 1] === '-'
      const rightStandsAlone = i + 1 === ops.length || ops[i + 1] === '+' || ops[i + 1] === '-'
      if ((leftStandsAlone && a.value === 0) || (rightStandsAlone && b.value === 0)) return true
      if (op === '-' && leftStandsAlone && rightStandsAlone && termText(a) === termText(b))
        return true
    }
    if (op === '×' && (a.value <= 1 || b.value <= 1)) return true
    if (op === '÷' && (a.value === 0 || b.value === 1)) return true
  }
  return false
}

function* expressionsOfLength(
  length: number,
  ops: Operator[],
  exponents: Term['exponent'][],
  max: number,
): Generator<Expression> {
  function* build(terms: Term[], used: Operator[], remaining: number): Generator<Expression> {
    for (let digits = 1; digits <= remaining; digits++) {
      const low = digits === 1 ? 0 : 10 ** (digits - 1)
      const high = Math.min(10 ** digits - 1, max)
      for (let value = low; value <= high; value++) {
        for (const exponent of exponents) {
          const width = digits + (exponent > 1 ? 1 : 0)
          if (width > remaining) continue
          const next = [...terms, { value, exponent }]
          if (width === remaining) yield { terms: next, ops: used }
          else if (width + 2 <= remaining)
            for (const op of ops) yield* build(next, [...used, op], remaining - width - 1)
        }
      }
    }
  }
  yield* build([], [], length)
}

/** Every non-trivial equation that fits the preset, sorted. */
export function generate(preset: Preset): string[] {
  const ops = preset.operators.filter(isOperator)
  const exponents: Term['exponent'][] = [
    1,
    ...preset.operators.filter(isPower).map((p) => (p === '²' ? 2 : 3) as 2 | 3),
  ]
  const { range, operatorCount: count } = preset
  const results = new Set<string>()

  for (let length = 1; length <= preset.tiles - 2; length++) {
    for (const expression of expressionsOfLength(length, ops, exponents, range.max)) {
      const n = operatorCount(expression)
      if (n < count.min || n > count.max || isTrivial(expression)) continue
      const value = evaluate(expression, range)
      if (value === null) continue
      const answer = String(value)
      if (length + 1 + answer.length !== preset.tiles) continue
      const text = expressionText(expression)
      results.add(`${text}=${answer}`)
      if (preset.answerSide === 'either') results.add(`${answer}=${text}`)
    }
  }
  return [...results].sort()
}
