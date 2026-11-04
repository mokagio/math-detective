import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { generate } from '../src/game/generate.ts'
import { PRESETS } from '../src/game/presets.ts'

const outputDirectory = join(import.meta.dirname, '..', 'src', 'puzzles')
mkdirSync(outputDirectory, { recursive: true })

for (const preset of PRESETS) {
  const puzzles = generate(preset)
  writeFileSync(join(outputDirectory, `${preset.id}.json`), JSON.stringify(puzzles) + '\n')
  console.log(`${preset.id}: ${puzzles.length}`)
}
