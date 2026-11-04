import { EQUALS, isDigit, isOperator, isPower, type Operator } from './symbols.ts'

export type Term = { value: number; exponent: 1 | 2 | 3 }

/** A side of an equation: `terms[0] ops[0] terms[1] ops[1] …`. */
export type Expression = { terms: Term[]; ops: Operator[] }

export type Equation = { left: Expression; right: Expression }

export function parseExpression(source: string): Expression | null {
  const terms: Term[] = []
  const ops: Operator[] = []
  let i = 0
  while (true) {
    let digits = ''
    while (i < source.length && isDigit(source[i])) digits += source[i++]
    if (digits === '' || (digits.length > 1 && digits[0] === '0')) return null
    let exponent: Term['exponent'] = 1
    if (i < source.length && isPower(source[i])) exponent = source[i++] === '²' ? 2 : 3
    terms.push({ value: Number(digits), exponent })
    if (i === source.length) return { terms, ops }
    const op = source[i++]
    if (!isOperator(op)) return null
    ops.push(op)
  }
}

export function parseEquation(source: string): Equation | null {
  const sides = source.split(EQUALS)
  if (sides.length !== 2) return null
  const left = parseExpression(sides[0])
  const right = parseExpression(sides[1])
  return left && right ? { left, right } : null
}
