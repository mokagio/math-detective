import type { Operator, Power } from './symbols.ts'

export type Preset = {
  id: string
  name: string
  tiles: number
  operators: (Operator | Power)[]
  /** Applies to every typed number, intermediate value and answer. */
  range: { min: number; max: number }
  /** `²` and `³` count as operators. */
  operatorCount: { min: number; max: number }
  /** Whether the answer may also come first, as in `15=7+8`. */
  answerSide: 'right' | 'either'
}

const little = (tiles: number): Preset => ({
  id: `little-${tiles}`,
  name: `Little-${tiles}`,
  tiles,
  operators: ['+', '-'],
  range: { min: 0, max: 99 },
  operatorCount: { min: 1, max: 1 },
  answerSide: 'right',
})

export const PRESETS: Preset[] = [
  little(5),
  little(6),
  little(7),
  {
    id: 'classic',
    name: 'Classic',
    tiles: 8,
    operators: ['+', '-', '×', '÷'],
    range: { min: 0, max: 99 },
    operatorCount: { min: 1, max: 3 },
    answerSide: 'right',
  },
  {
    id: 'stretch',
    name: 'Stretch',
    tiles: 8,
    operators: ['+', '-', '×', '÷', '²', '³'],
    range: { min: 0, max: 999 },
    operatorCount: { min: 1, max: 3 },
    answerSide: 'either',
  },
]

export const presetById = (id: string) => PRESETS.find((p) => p.id === id)
