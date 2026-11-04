export type Mark = 'correct' | 'present' | 'absent'

export type KeyMarks = Partial<Record<string, Mark>>

/** A repeated symbol is marked only as many times as it appears in the answer. */
export function score(guess: string, answer: string): Mark[] {
  const marks: Mark[] = Array.from(guess, () => 'absent')
  const unmatched = new Map<string, number>()

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === answer[i]) marks[i] = 'correct'
    else unmatched.set(answer[i], (unmatched.get(answer[i]) ?? 0) + 1)
  }
  for (let i = 0; i < guess.length; i++) {
    const left = unmatched.get(guess[i]) ?? 0
    if (marks[i] === 'correct' || left === 0) continue
    marks[i] = 'present'
    unmatched.set(guess[i], left - 1)
  }
  return marks
}

const rank: Record<Mark, number> = { absent: 0, present: 1, correct: 2 }

export function mergeKeyMarks(keys: KeyMarks, guess: string, marks: Mark[]): KeyMarks {
  const merged = { ...keys }
  for (let i = 0; i < guess.length; i++) {
    const previous = merged[guess[i]]
    if (!previous || rank[marks[i]] > rank[previous]) merged[guess[i]] = marks[i]
  }
  return merged
}
