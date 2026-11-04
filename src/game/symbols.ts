export const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const
export const OPERATORS = ['+', '-', '×', '÷'] as const
export const POWERS = ['²', '³'] as const
export const EQUALS = '='

export type Digit = (typeof DIGITS)[number]
export type Operator = (typeof OPERATORS)[number]
export type Power = (typeof POWERS)[number]
export type Tile = Digit | Operator | Power | typeof EQUALS

export const isDigit = (c: string): c is Digit => c.length === 1 && c >= '0' && c <= '9'
export const isOperator = (c: string): c is Operator => (OPERATORS as readonly string[]).includes(c)
export const isPower = (c: string): c is Power => (POWERS as readonly string[]).includes(c)
