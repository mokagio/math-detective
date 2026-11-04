import { createDeck } from '../game/deck.ts'

const loaders = import.meta.glob<string[]>('../puzzles/*.json', { import: 'default' })
const decks = new Map<string, ReturnType<typeof createDeck>>()

export async function nextPuzzle(presetId: string): Promise<string> {
  let deck = decks.get(presetId)
  if (!deck) {
    const load = loaders[`../puzzles/${presetId}.json`]
    if (!load) throw new Error(`No puzzles for preset ${presetId}`)
    deck = createDeck(await load())
    decks.set(presetId, deck)
  }
  return deck.next()
}
