import fs from 'fs'
import path from 'path'

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

const args = process.argv.slice(2)
if (args.length < 2) {
  console.error('Usage: npx tsx scripts/import-csv.ts <csv-file> <topic-slug>')
  process.exit(1)
}

const [csvPath, slug] = args
const csvContent = fs.readFileSync(csvPath, 'utf-8')
const lines = csvContent.split('\n').filter(l => l.trim())

const cards = lines.map((line, i) => {
  const [question, answer] = parseCSVLine(line)
  return { id: i + 1, question, answer }
})

const outDir = path.join('public', 'content', slug)
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(
  path.join(outDir, 'flashcards.json'),
  JSON.stringify({ cards }, null, 2)
)

console.log(`Imported ${cards.length} flashcards to ${outDir}/flashcards.json`)
