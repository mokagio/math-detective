import { describe, expect, it } from 'vitest'
import { MAX_ATTEMPTS, roundReducer, startRound, type Round } from '../src/game/round.ts'

const play = (round: Round, ...guesses: string[]) =>
  guesses.reduce((r, guess) => {
    const typed = [...guess].reduce((s, tile) => roundReducer(s, { type: 'type', tile }), r)
    return roundReducer(typed, { type: 'submit' })
  }, round)

describe('a round', () => {
  it('is won by the exact equation', () => {
    expect(play(startRound('7+8=15'), '7+8=15').status).toBe('won')
  })

  it('is not won by a swapped or mirrored equation', () => {
    const round = play(startRound('7+8=15'), '8+7=15', '15=7+8')
    expect(round.status).toBe('playing')
    expect(round.guesses).toHaveLength(2)
  })

  it(`reveals the answer after ${MAX_ATTEMPTS} wrong guesses`, () => {
    const round = play(startRound('7+8=15'), ...Array(MAX_ATTEMPTS).fill('9+6=15'))
    expect(round.status).toBe('revealed')
  })

  it('rejects an invalid guess without using an attempt', () => {
    const round = play(startRound('7+8=15'), '7+8=16')
    expect(round.guesses).toHaveLength(0)
    expect(round.input).toBe('7+8=16')
    expect(round.rejection).toEqual({ reason: 'untrue', count: 1 })
    expect(roundReducer(round, { type: 'submit' }).rejection?.count).toBe(2)
  })

  it('ignores typing past the last tile', () => {
    const round = play(startRound('1+1=2'), '1+1=2+')
    expect(round.input).toBe('')
    expect(round.status).toBe('won')
  })

  it('ignores input once finished', () => {
    const won = play(startRound('1+1=2'), '1+1=2')
    expect(roundReducer(won, { type: 'type', tile: '1' })).toBe(won)
  })
})
