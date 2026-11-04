import { describe, expect, it } from 'vitest'
import { createDeck } from '../src/game/deck.ts'

const puzzles = ['1+1=2', '1+2=3', '2+2=4', '3+2=5', '4-1=3']

describe('deck', () => {
  it('draws every puzzle once before repeating', () => {
    const deck = createDeck(puzzles)
    const drawn = puzzles.map(() => deck.next())
    expect([...drawn].sort()).toEqual([...puzzles].sort())
  })

  it('never draws the same puzzle twice in a row across reshuffles', () => {
    const deck = createDeck(puzzles)
    let previous = deck.next()
    for (let i = 0; i < 500; i++) {
      const current = deck.next()
      expect(current).not.toBe(previous)
      previous = current
    }
  })

  it('works with a single puzzle', () => {
    const deck = createDeck(['1+1=2'])
    expect([deck.next(), deck.next()]).toEqual(['1+1=2', '1+1=2'])
  })
})
