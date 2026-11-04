/** Draws every puzzle once in random order, then reshuffles. */
export function createDeck(puzzles: readonly string[], random: () => number = Math.random) {
  let order: string[] = []
  let last: string | undefined

  const shuffle = () => {
    order = [...puzzles]
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    // Avoid repeating the previous puzzle across a reshuffle.
    if (order.length > 1 && order[order.length - 1] === last) order.unshift(order.pop()!)
  }

  return {
    next(): string {
      if (order.length === 0) shuffle()
      last = order.pop()!
      return last
    },
  }
}
