import type { Expression } from './parse.ts'

export type Bounds = { min: number; max: number }

/**
 * Evaluates with standard precedence: powers, then `×` `÷`, then `+` `-`, left to right.
 * Returns `null` when `÷` doesn't divide exactly, or, given bounds, when any typed number,
 * power, running product or running sum leaves them.
 */
export function evaluate(expression: Expression, bounds?: Bounds): number | null {
  const inBounds = (n: number) => !bounds || (n >= bounds.min && n <= bounds.max)
  const { terms, ops } = expression

  const powered = terms.map(({ value, exponent }) =>
    inBounds(value) ? value ** exponent : Number.NaN,
  )
  if (powered.some((n) => Number.isNaN(n) || !inBounds(n))) return null

  const addends = [powered[0]]
  const signs: ('+' | '-')[] = []
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i]
    const operand = powered[i + 1]
    if (op === '+' || op === '-') {
      addends.push(operand)
      signs.push(op)
      continue
    }
    const current = addends[addends.length - 1]
    let product: number
    if (op === '×') {
      product = current * operand
    } else {
      if (operand === 0 || current % operand !== 0) return null
      product = current / operand
    }
    if (!inBounds(product)) return null
    addends[addends.length - 1] = product
  }

  let total = addends[0]
  for (let i = 0; i < signs.length; i++) {
    total = signs[i] === '+' ? total + addends[i + 1] : total - addends[i + 1]
    if (!inBounds(total)) return null
  }
  return total
}
