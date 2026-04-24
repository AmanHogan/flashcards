import type { FlashCard, FlashCardSet, Skill } from "@/types/types"

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Build one tab-delimited line for a card.
 *  Columns: term  definition  [groupName]  [hint]
 *  Extra columns are only written when at least one card in the set has a value,
 *  so the file stays clean for simple sets but round-trips fully for rich ones.
 */
function cardToLine(
  card: Pick<FlashCard, "term" | "definition" | "groupName" | "hint">,
  includeGroup: boolean,
  includeHint: boolean,
): string {
  const parts = [card.term, card.definition]
  if (includeGroup || includeHint) parts.push(card.groupName ?? "")
  if (includeHint) parts.push(card.hint ?? "")
  return parts.join("\t")
}

// ── Exports ───────────────────────────────────────────────────────────────────

export function exportSkillsToMarkdown(skills: Skill[]): void {
  const byProficiency: Record<number, Skill[]> = {}
  for (const s of skills) {
    if (!byProficiency[s.proficiency]) byProficiency[s.proficiency] = []
    byProficiency[s.proficiency].push(s)
  }

  const lines: string[] = ["# Skills Export\n"]
  for (let p = 5; p >= 1; p--) {
    const group = byProficiency[p]
    if (!group || group.length === 0) continue
    lines.push(`## Proficiency ${p}/5\n`)
    for (const s of group) {
      lines.push(`- **${s.name}**${s.date ? ` (${s.date})` : ""}`)
    }
    lines.push("")
  }

  trigger(lines.join("\n"), "skills.md", "text/markdown")
}

export function exportSetToText(title: string, cards: FlashCard[]): void {
  const includeGroup = cards.some(c => c.groupName)
  const includeHint = cards.some(c => c.hint)
  const lines = cards.map(c => cardToLine(c, includeGroup, includeHint))
  trigger(lines.join("\n"), `${title.replace(/\s+/g, "_")}.txt`, "text/plain")
}

export function exportAllSetsToText(sets: FlashCardSet[]): void {
  const lines: string[] = []
  for (const set of sets) {
    lines.push(`# ${set.title}`)
    const cards = set.flashCards ?? []
    const includeGroup = cards.some(c => c.groupName)
    const includeHint = cards.some(c => c.hint)
    for (const c of cards) {
      lines.push(cardToLine(c, includeGroup, includeHint))
    }
    lines.push("")
  }
  trigger(lines.join("\n"), "all_sets.txt", "text/plain")
}

function trigger(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
