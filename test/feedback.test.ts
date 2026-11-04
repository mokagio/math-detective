import { describe, expect, it } from 'vitest'
import { mergeKeyMarks, score } from '../src/game/feedback.ts'

const marks = (guess: string, answer: string) =>
  score(guess, answer)
    .map((m) => ({ correct: 'C', present: 'P', absent: '.' })[m])
    .join('')

describe('scoring a guess', () => {
  it('marks an exact match all correct', () => {
    expect(marks('7+8=15', '7+8=15')).toBe('CCCCCC')
  })

  it('treats swapped operands as misplaced, not a win', () => {
    expect(marks('8+7=15', '7+8=15')).toBe('PCPCCC')
  })

  it('treats a mirrored equation as misplaced, not a win', () => {
    expect(marks('15=7+8', '7+8=15')).toBe('PPPPPP')
  })

  it('marks a repeated symbol only as often as the answer has it', () => {
    expect(marks('11+1=13', '12+1=13')).toBe('C.CCCCC')
  })

  it('prefers the exact match when a repeat is both placed and misplaced', () => {
    expect(marks('5+5=10', '9+1=10')).toBe('.C.CCC')
    expect(marks('1+9=10', '9+1=10')).toBe('PCPCCC')
  })

  it('marks surplus copies absent once the answer runs out', () => {
    expect(marks('1+11=13', '12+1=13')).toBe('CP.CCCC')
  })
})

describe('keyboard marks', () => {
  it('keeps the best mark each key has had', () => {
    let keys = mergeKeyMarks({}, '1+2=3', score('1+2=3', '3-2=1'))
    expect(keys).toMatchObject({ '1': 'present', '+': 'absent', '2': 'correct', '3': 'present' })
    keys = mergeKeyMarks(keys, '1+1=2', score('1+1=2', '3-2=1'))
    expect(keys).toMatchObject({ '1': 'present', '2': 'correct' })
  })
})
