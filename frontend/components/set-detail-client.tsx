"use client"

import { useState, useId, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { FlashCard, FlashCardSet, Skill } from "@/types/types"
import { setApi, cardApi, skillApi } from "@/lib/api"
import { Markdown } from "@/components/markdown"
import { exportSetToText } from "@/lib/utils/export-markdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  Pencil,
  Trash2,
  Plus,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Download,
  Upload,
  Check,
  X,
  BookOpen,
  GraduationCap,
} from "lucide-react"
import { ImportCardsPanel, type ParsedCard } from "@/components/import-cards-panel"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// ─── Proficiency constants ───────────────────────────────────────────────────

const PROF_COLORS: Record<number, string> = {
  1: "#ef4444",
  2: "#f97316",
  3: "#eab308",
  4: "#22c55e",
  5: "#3b82f6",
}

const PROF_LABELS: Record<number, string> = {
  1: "Novice",
  2: "Beginner",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
}

// ─── Insert-between form ────────────────────────────────────────────────────

interface InsertFormProps {
  groups: string[]
  onInsert: (term: string, def: string, group: string, hint: string) => Promise<void>
  onCancel: () => void
}

function InsertCardForm({ groups, onInsert, onCancel }: InsertFormProps) {
  const [term, setTerm] = useState("")
  const [def, setDef] = useState("")
  const [group, setGroup] = useState("")
  const [hint, setHint] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!term.trim() || !def.trim()) return
    setSaving(true)
    await onInsert(term, def, group, hint)
    setSaving(false)
  }

  return (
    <div className="border border-primary/40 rounded-lg bg-primary/5 p-3 space-y-2">
      <p className="text-xs font-semibold text-primary">Insert card here</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Term *</Label>
          <Textarea
            autoFocus
            value={term}
            onChange={e => setTerm(e.target.value)}
            rows={3}
            placeholder="Term"
            className="text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Definition *</Label>
          <Textarea
            value={def}
            onChange={e => setDef(e.target.value)}
            rows={3}
            placeholder="Definition"
            className="text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Group</Label>
          <Input
            list="insert-groups"
            value={group}
            onChange={e => setGroup(e.target.value)}
            className="h-8 text-sm"
            placeholder="Group (optional)"
          />
          <datalist id="insert-groups">
            {groups.map(g => <option key={g} value={g} />)}
          </datalist>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Hint</Label>
          <Input value={hint} onChange={e => setHint(e.target.value)} className="h-8 text-sm" placeholder="Hint (optional)" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={saving || !term.trim() || !def.trim()}>
          <Check className="h-3 w-3 mr-1" /> {saving ? "Inserting..." : "Insert Card"}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="h-3 w-3 mr-1" /> Cancel
        </Button>
      </div>
    </div>
  )
}

// ─── Sortable Card Row ──────────────────────────────────────────────────────

interface SortableCardProps {
  card: FlashCard
  groups: string[]
  insertOpen: boolean
  isLast: boolean
  onToggleInsert: () => void
  onInsert: (term: string, def: string, group: string, hint: string) => Promise<void>
  onStar: (id: number) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, data: Partial<FlashCard>) => Promise<void>
}

function SortableCard({
  card, groups, insertOpen, isLast,
  onToggleInsert, onInsert, onStar, onDelete, onUpdate,
}: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const [editing, setEditing] = useState(false)
  const [term, setTerm] = useState(card.term)
  const [definition, setDefinition] = useState(card.definition)
  const [groupName, setGroupName] = useState(card.groupName ?? "")
  const [hint, setHint] = useState(card.hint ?? "")
  const [saving, setSaving] = useState(false)

  async function saveEdit() {
    setSaving(true)
    await onUpdate(card.id, { term, definition, groupName: groupName || undefined, hint: hint || undefined })
    setSaving(false)
    setEditing(false)
  }

  function cancelEdit() {
    setTerm(card.term)
    setDefinition(card.definition)
    setGroupName(card.groupName ?? "")
    setHint(card.hint ?? "")
    setEditing(false)
  }

  return (
    <>
      {/* The draggable card element — ref must be here, not on the fragment */}
      <div ref={setNodeRef} style={style} className="border rounded-lg bg-card">
        {editing ? (
          <div className="p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Term</Label>
                <Textarea value={term} onChange={e => setTerm(e.target.value)} rows={3} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Definition</Label>
                <Textarea value={definition} onChange={e => setDefinition(e.target.value)} rows={3} className="text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Group</Label>
                <Input list={`groups-${card.id}`} value={groupName} onChange={e => setGroupName(e.target.value)} className="h-8 text-sm" placeholder="Group name" />
                <datalist id={`groups-${card.id}`}>
                  {groups.map(g => <option key={g} value={g} />)}
                </datalist>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hint</Label>
                <Input value={hint} onChange={e => setHint(e.target.value)} className="h-8 text-sm" placeholder="Optional hint" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={saveEdit} disabled={saving}>
                <Check className="h-3 w-3 mr-1" /> {saving ? "Saving..." : "Save"}
              </Button>
              <Button size="sm" variant="outline" onClick={cancelEdit}>
                <X className="h-3 w-3 mr-1" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2 p-3">
            <button
              {...attributes}
              {...listeners}
              className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0"
              title="Drag to reorder"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="flex-1 grid grid-cols-2 gap-3 min-w-0">
              <div className="text-sm">
                <Markdown>{card.term}</Markdown>
                {card.hint && <p className="text-xs text-muted-foreground mt-1 italic">Hint: {card.hint}</p>}
              </div>
              <div className="text-sm text-muted-foreground">
                <Markdown>{card.definition}</Markdown>
              </div>
            </div>
              <div className="flex items-center gap-1">
                {card.groupName && (
                  <Badge variant="outline" className="text-xs">{card.groupName}</Badge>
                )}
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onStar(card.id)}>
                  <Star className={`h-3.5 w-3.5 ${card.starred ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setEditing(true)}>
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-destructive" onClick={() => onDelete(card.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
        )}
      </div>

      {/* Insert-between divider — always rendered, only visible on hover */}
      <div className="group relative h-7 flex items-center">
        <div className="absolute inset-x-0 h-px bg-transparent group-hover:bg-border transition-colors" />
        <button
          onClick={onToggleInsert}
          className={`absolute left-1/2 -translate-x-1/2 z-10 h-6 w-6 rounded-full bg-background border-2 flex items-center justify-center transition-all
            ${insertOpen
              ? "border-primary text-primary opacity-100 rotate-45"
              : "border-border text-muted-foreground opacity-0 group-hover:opacity-100 hover:border-primary hover:text-primary hover:scale-110"
            }`}
          title={insertOpen ? "Close" : "Insert card here"}
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      {/* Inline insert form */}
      {insertOpen && (
        <InsertCardForm groups={groups} onInsert={onInsert} onCancel={onToggleInsert} />
      )}
    </>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

interface Props {
  set: FlashCardSet
  skills: Skill[]
}

export function SetDetailClient({ set: initialSet, skills: initialSkills }: Props) {
  const router = useRouter()
  const dndId = useId()

  const [set, setSet] = useState(initialSet)
  const [cards, setCards] = useState(initialSet.flashCards ?? [])
  const [skills, setSkills] = useState(initialSkills)

  // Study state
  const [studyMode, setStudyMode] = useState(false)
  const [studyGroup, setStudyGroup] = useState<string | null>(null)
  const [studyIdx, setStudyIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [studyReversed, setStudyReversed] = useState(false)

  // Edit set state
  const [editingSet, setEditingSet] = useState(false)
  const [setTitle, setSetTitle] = useState(set.title)
  const [setDesc, setSetDesc] = useState(set.description ?? "")
  const [setTopic, setSetTopic] = useState(set.topic ?? "")
  const [setTagInput, setSetTagInput] = useState("")
  const [setTags, setSetTags] = useState(set.tags ?? [])
  const [savingSet, setSavingSet] = useState(false)

  // Add card state (appends to end)
  const [addingCard, setAddingCard] = useState(false)
  const [newTerm, setNewTerm] = useState("")
  const [newDef, setNewDef] = useState("")
  const [newGroup, setNewGroup] = useState("")
  const [newHint, setNewHint] = useState("")

  // Insert-between state
  const [insertingAtIndex, setInsertingAtIndex] = useState<number | null>(null)

  // Bulk import state
  const [importing, setImporting] = useState(false)

  // Add skill state
  const [newSkillName, setNewSkillName] = useState("")
  const [newSkillProf, setNewSkillProf] = useState(3)
  const [newSkillDate, setNewSkillDate] = useState("")
  const [addingSkill, setAddingSkill] = useState(false)

  // Edit skill state
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null)
  const [editSkillName, setEditSkillName] = useState("")
  const [editSkillProf, setEditSkillProf] = useState(3)
  const [editSkillDate, setEditSkillDate] = useState("")

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Derived
  const groups = Array.from(new Set(cards.map(c => c.groupName).filter(Boolean))) as string[]
  const studyCards = studyGroup ? cards.filter(c => c.groupName === studyGroup) : cards

  // ── Study mode ──
  function startStudy(group?: string) {
    setStudyGroup(group ?? null)
    setStudyIdx(0)
    setFlipped(false)
    setStudyMode(true)
    setApi.study(set.id).catch(() => {})
  }

  function nextCard() { setFlipped(false); setStudyIdx(i => Math.min(i + 1, studyCards.length - 1)) }
  function prevCard() { setFlipped(false); setStudyIdx(i => Math.max(i - 1, 0)) }
  function resetStudy() { setStudyIdx(0); setFlipped(false) }

  // ── Edit set ──
  async function saveSet() {
    setSavingSet(true)
    try {
      const updated = await setApi.update(set.id, {
        title: setTitle,
        description: setDesc || undefined,
        topic: setTopic || undefined,
        tags: setTags,
      })
      setSet(updated)
      setEditingSet(false)
    } catch (e: any) { alert(e.message) }
    setSavingSet(false)
  }

  // ── Card operations ──
  async function handleUpdate(cardId: number, data: Partial<FlashCard>) {
    const updated = await cardApi.update(set.id, cardId, data)
    setCards(cs => cs.map(c => c.id === cardId ? { ...c, ...updated } : c))
  }

  async function handleStar(cardId: number) {
    const updated = await cardApi.toggleStar(set.id, cardId)
    setCards(cs => cs.map(c => c.id === cardId ? { ...c, starred: updated.starred } : c))
  }

  async function handleDelete(cardId: number) {
    if (!confirm("Delete this card?")) return
    await cardApi.delete(set.id, cardId)
    setCards(cs => cs.filter(c => c.id !== cardId))
  }

  async function handleAddCard() {
    if (!newTerm.trim() || !newDef.trim()) return
    const card = await cardApi.create(set.id, {
      term: newTerm,
      definition: newDef,
      groupName: newGroup || undefined,
      hint: newHint || undefined,
      sortOrder: cards.length,
      starred: false,
    })
    setCards(cs => [...cs, card])
    setNewTerm(""); setNewDef(""); setNewGroup(""); setNewHint("")
    setAddingCard(false)
  }

  async function handleInsertBetween(
    afterIndex: number,
    term: string,
    definition: string,
    groupName: string,
    hint: string,
  ) {
    const insertSortOrder = afterIndex + 1
    const card = await cardApi.create(set.id, {
      term,
      definition,
      groupName: groupName || undefined,
      hint: hint || undefined,
      sortOrder: insertSortOrder,
      starred: false,
    })
    // Rebuild the list with corrected sort orders
    const newCards = [
      ...cards.slice(0, insertSortOrder),
      { ...card, sortOrder: insertSortOrder },
      ...cards.slice(insertSortOrder).map((c, i) => ({ ...c, sortOrder: insertSortOrder + 1 + i })),
    ]
    setCards(newCards)
    setInsertingAtIndex(null)
    // Persist sort orders for shifted cards
    await Promise.all(
      newCards.slice(insertSortOrder + 1).map(c =>
        cardApi.update(set.id, c.id, { sortOrder: c.sortOrder }).catch(() => {})
      )
    )
  }

  async function handleBulkImport(parsedCards: ParsedCard[]) {
    const payload = parsedCards.map((c, i) => ({
      term: c.term,
      definition: c.definition,
      groupName: c.groupName,
      hint: c.hint,
      sortOrder: cards.length + i,
      starred: false,
    }))
    const created = await cardApi.createBulk(set.id, payload)
    setCards(cs => [...cs, ...created])
    setImporting(false)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = cards.findIndex(c => c.id === active.id)
    const newIndex = cards.findIndex(c => c.id === over.id)
    const reordered = arrayMove(cards, oldIndex, newIndex)
    setCards(reordered)
    // Persist sort order
    await Promise.all(
      reordered.map((card, i) =>
        cardApi.update(set.id, card.id, { sortOrder: i }).catch(() => {})
      )
    )
  }

  // ── Skills ──
  async function handleAddSkill() {
    if (!newSkillName.trim()) return
    setAddingSkill(true)
    try {
      const skill = await skillApi.create({
        name: newSkillName,
        proficiency: newSkillProf,
        date: newSkillDate || undefined,
        flashCardSetId: set.id,
      })
      setSkills(ss => [...ss, skill])
      setNewSkillName("")
      setNewSkillProf(3)
      setNewSkillDate("")
    } catch (e: any) { alert(e.message) }
    setAddingSkill(false)
  }

  function startEditSkill(skill: Skill) {
    setEditingSkillId(skill.id)
    setEditSkillName(skill.name)
    setEditSkillProf(skill.proficiency)
    setEditSkillDate(skill.date ?? "")
  }

  async function handleSaveSkill(skillId: number) {
    try {
      const updated = await skillApi.update(skillId, {
        name: editSkillName,
        proficiency: editSkillProf,
        date: editSkillDate || undefined,
        flashCardSetId: set.id,
      })
      setSkills(ss => ss.map(s => s.id === skillId ? updated : s))
      setEditingSkillId(null)
    } catch (e: any) { alert(e.message) }
  }

  async function handleDeleteSkill(skillId: number) {
    await skillApi.delete(skillId)
    setSkills(ss => ss.filter(s => s.id !== skillId))
  }

  // ── Delete set ──
  async function handleDeleteSet() {
    if (!confirm(`Delete "${set.title}"? This cannot be undone.`)) return
    await setApi.delete(set.id)
    router.push("/dashboard/sets")
  }

  // ── Keyboard navigation in study mode ──
  useEffect(() => {
    if (!studyMode) return
    function onKey(e: KeyboardEvent) {
      // Don't hijack keys when user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); setFlipped(f => !f) }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); nextCard() }
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   { e.preventDefault(); prevCard() }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [studyMode, studyIdx, studyCards.length])

  // ── Study Mode UI ──
  if (studyMode) {
    const current = studyCards[studyIdx]
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Button variant="outline" onClick={() => setStudyMode(false)}>
            ← Back to set
          </Button>
          <span className="text-sm text-muted-foreground">
            {studyGroup ? `Group: ${studyGroup} · ` : ""}{studyIdx + 1} / {studyCards.length}
          </span>
          <Button
            variant={studyReversed ? "default" : "outline"}
            size="sm"
            onClick={() => { setStudyReversed(r => !r); setFlipped(false) }}
            title="Swap which side shows first"
          >
            ⇄ {studyReversed ? "Definition → Term" : "Term → Definition"}
          </Button>
        </div>

        {current ? (
          /* ── 3-D flip card ── */
          <div
            role="button"
            tabIndex={0}
            onClick={() => setFlipped(f => !f)}
            onKeyDown={e => e.key === " " || e.key === "Enter" ? setFlipped(f => !f) : undefined}
            className="cursor-pointer select-none"
            style={{ perspective: "1200px", minHeight: "16rem" }}
            title="Click or press Space to flip"
          >
            {/* Rotating inner wrapper */}
            <div
              style={{
                transformStyle: "preserve-3d",
                transition: "transform 0.45s cubic-bezier(0.4, 0.2, 0.2, 1)",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                position: "relative",
                minHeight: "16rem",
              }}
            >
              {/* Front face — Term (normal) or Definition (reversed) */}
              <div
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                className="absolute inset-0 border rounded-xl p-8 flex flex-col items-center justify-center text-center bg-card shadow-sm"
              >
                <Badge variant="outline" className="text-xs mb-4">
                  {studyReversed ? "Definition" : "Term"}
                </Badge>
                <div className="text-xl w-full">
                  <Markdown>{studyReversed ? current.definition : current.term}</Markdown>
                </div>
                {!studyReversed && current.hint && (
                  <p className="text-sm text-muted-foreground italic mt-3">Hint: {current.hint}</p>
                )}
                <p className="text-xs text-muted-foreground mt-4 opacity-60">Click or press Space to flip</p>
              </div>

              {/* Back face — Definition (normal) or Term (reversed) */}
              <div
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
                className="absolute inset-0 border rounded-xl p-8 flex flex-col items-center justify-center text-center bg-accent/30 shadow-sm"
              >
                <Badge variant="secondary" className="text-xs mb-4">
                  {studyReversed ? "Term" : "Definition"}
                </Badge>
                <div className="text-xl w-full">
                  <Markdown>{studyReversed ? current.term : current.definition}</Markdown>
                </div>
                {studyReversed && current.hint && (
                  <p className="text-sm text-muted-foreground italic mt-3">Hint: {current.hint}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No cards in this group.</CardContent></Card>
        )}

        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={prevCard} disabled={studyIdx === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={resetStudy}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextCard} disabled={studyIdx >= studyCards.length - 1}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {current && (
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" onClick={() => handleStar(current.id)}>
              <Star className={`h-4 w-4 mr-1 ${current.starred ? "fill-yellow-500 text-yellow-500" : ""}`} />
              {current.starred ? "Unstar" : "Star"}
            </Button>
          </div>
        )}
      </div>
    )
  }

  // ── Main View ──
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {editingSet ? (
            <div className="space-y-3">
              <Input value={setTitle} onChange={e => setSetTitle(e.target.value)} className="text-xl font-bold h-auto py-1" />
              <Textarea value={setDesc} onChange={e => setSetDesc(e.target.value)} placeholder="Description" rows={2} className="text-sm" />
              <Input value={setTopic} onChange={e => setSetTopic(e.target.value)} placeholder="Topic" className="h-8 text-sm" />
              <div className="flex gap-2">
                <Input
                  value={setTagInput}
                  onChange={e => setSetTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const t = setTagInput.trim()
                      if (t && !setTags.includes(t)) setSetTags([...setTags, t])
                      setSetTagInput("")
                    }
                  }}
                  placeholder="Add tag, press Enter"
                  className="h-8 text-sm"
                />
              </div>
              {setTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {setTags.map(t => (
                    <Badge key={t} variant="secondary" className="cursor-pointer text-xs" onClick={() => setSetTags(setTags.filter(x => x !== t))}>
                      {t} ×
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Button size="sm" onClick={saveSet} disabled={savingSet}>{savingSet ? "Saving..." : "Save"}</Button>
                <Button size="sm" variant="outline" onClick={() => setEditingSet(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold">{set.title}</h1>
              {set.topic && <p className="text-sm text-muted-foreground">{set.topic}</p>}
              {set.description && <p className="text-sm text-muted-foreground mt-1">{set.description}</p>}
              {(set.tags ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {set.tags!.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => setEditingSet(!editingSet)}>
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportSetToText(set.title, cards)}>
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDeleteSet}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>{cards.length} cards</span>
        <span>·</span>
        <span>{set.timesStudied} study sessions</span>
      </div>

      <Tabs defaultValue="cards">
        <TabsList>
          <TabsTrigger value="cards"><BookOpen className="h-4 w-4 mr-1.5" />Cards</TabsTrigger>
          <TabsTrigger value="study"><BookOpen className="h-4 w-4 mr-1.5" />Study</TabsTrigger>
          <TabsTrigger value="skills"><GraduationCap className="h-4 w-4 mr-1.5" />Skills</TabsTrigger>
        </TabsList>

        {/* Cards Tab */}
        <TabsContent value="cards" className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{cards.length} cards · drag <GripVertical className="inline h-3 w-3" /> to reorder · hover between cards to insert</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => { setImporting(!importing); setAddingCard(false) }}>
                <Upload className="h-4 w-4 mr-1" /> Import
              </Button>
              <Button size="sm" onClick={() => { setAddingCard(!addingCard); setImporting(false) }}>
                <Plus className="h-4 w-4 mr-1" /> Add to End
              </Button>
            </div>
          </div>

          {importing && (
            <ImportCardsPanel
              groups={groups}
              onImport={handleBulkImport}
              onClose={() => setImporting(false)}
            />
          )}

          {addingCard && (
            <Card className="bg-accent/30 border-dashed">
              <CardContent className="pt-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Append card to end</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Term *</Label>
                    <Textarea autoFocus value={newTerm} onChange={e => setNewTerm(e.target.value)} rows={3} placeholder="Term" className="text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Definition *</Label>
                    <Textarea value={newDef} onChange={e => setNewDef(e.target.value)} rows={3} placeholder="Definition" className="text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Group</Label>
                    <Input list="new-card-groups" value={newGroup} onChange={e => setNewGroup(e.target.value)} className="h-8 text-sm" placeholder="Group" />
                    <datalist id="new-card-groups">{groups.map(g => <option key={g} value={g} />)}</datalist>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Hint</Label>
                    <Input value={newHint} onChange={e => setNewHint(e.target.value)} className="h-8 text-sm" placeholder="Hint" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddCard} disabled={!newTerm.trim() || !newDef.trim()}>Add</Button>
                  <Button size="sm" variant="outline" onClick={() => setAddingCard(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-0">
                {cards.map((card, idx) => (
                  <SortableCard
                    key={card.id}
                    card={card}
                    groups={groups}
                    insertOpen={insertingAtIndex === idx}
                    isLast={idx === cards.length - 1}
                    onToggleInsert={() =>
                      setInsertingAtIndex(insertingAtIndex === idx ? null : idx)
                    }
                    onInsert={(term, def, group, hint) =>
                      handleInsertBetween(idx, term, def, group, hint)
                    }
                    onStar={handleStar}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {cards.length === 0 && (
            <Card><CardContent className="py-10 text-center text-muted-foreground">No cards yet. Add one above!</CardContent></Card>
          )}
        </TabsContent>

        {/* Study Tab */}
        <TabsContent value="study" className="space-y-4 mt-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-medium mb-2">Study all cards</h3>
              <Button onClick={() => startStudy()}>
                <BookOpen className="h-4 w-4 mr-1" /> Start Study ({cards.length} cards)
              </Button>
            </div>
            {groups.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Study by group</h3>
                <div className="flex flex-wrap gap-2">
                  {groups.map(g => {
                    const count = cards.filter(c => c.groupName === g).length
                    return (
                      <Button key={g} variant="outline" size="sm" onClick={() => startStudy(g)}>
                        {g} ({count})
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-5 mt-4">

          {/* Stats + distribution bar */}
          {skills.length > 0 && (
            <div className="flex items-center gap-6 p-3 bg-muted/40 rounded-lg text-sm flex-wrap">
              <div>
                <span className="text-muted-foreground">Skills </span>
                <span className="font-semibold">{skills.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Avg proficiency </span>
                <span className="font-semibold">
                  {(skills.reduce((a, s) => a + s.proficiency, 0) / skills.length).toFixed(1)}
                </span>
              </div>
              <div className="ml-auto flex items-center gap-3">
                {[1, 2, 3, 4, 5].map(p => {
                  const count = skills.filter(s => s.proficiency === p).length
                  return count > 0 ? (
                    <div key={p} className="flex items-center gap-1">
                      <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: PROF_COLORS[p] }} />
                      <span className="text-xs text-muted-foreground">{PROF_LABELS[p]}: {count}</span>
                    </div>
                  ) : null
                })}
              </div>
            </div>
          )}

          {/* Add skill form */}
          <div className="border rounded-lg p-4 bg-card space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Add Skill</p>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-40 space-y-1">
                <Label className="text-xs">Name</Label>
                <Input
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddSkill()}
                  placeholder="e.g. Photosynthesis"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Proficiency</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewSkillProf(p)}
                      title={PROF_LABELS[p]}
                      className={`h-8 w-8 rounded text-xs font-bold border transition-all ${
                        newSkillProf === p
                          ? "text-white border-transparent scale-110"
                          : "text-muted-foreground border-border hover:border-primary"
                      }`}
                      style={newSkillProf === p ? { backgroundColor: PROF_COLORS[p] } : {}}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Date (optional)</Label>
                <Input
                  type="date"
                  value={newSkillDate}
                  onChange={e => setNewSkillDate(e.target.value)}
                  className="h-8 text-sm w-36"
                />
              </div>
              <Button size="sm" onClick={handleAddSkill} disabled={addingSkill || !newSkillName.trim()} className="shrink-0">
                <Plus className="h-4 w-4 mr-1" /> {addingSkill ? "Adding..." : "Add"}
              </Button>
            </div>
            {newSkillProf > 0 && (
              <p className="text-xs text-muted-foreground">
                Level {newSkillProf} — <span style={{ color: PROF_COLORS[newSkillProf] }}>{PROF_LABELS[newSkillProf]}</span>
              </p>
            )}
          </div>

          {/* Skills list */}
          {skills.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-card">
              <GraduationCap className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No skills tracked for this set yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {skills.map(skill => (
                <div key={skill.id} className="border rounded-lg p-3 bg-card">
                  {editingSkillId === skill.id ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-3 items-end">
                        <div className="flex-1 min-w-40 space-y-1">
                          <Label className="text-xs">Name</Label>
                          <Input value={editSkillName} onChange={e => setEditSkillName(e.target.value)} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Proficiency</Label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(p => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setEditSkillProf(p)}
                                title={PROF_LABELS[p]}
                                className={`h-8 w-8 rounded text-xs font-bold border transition-all ${
                                  editSkillProf === p
                                    ? "text-white border-transparent scale-110"
                                    : "text-muted-foreground border-border"
                                }`}
                                style={editSkillProf === p ? { backgroundColor: PROF_COLORS[p] } : {}}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Date</Label>
                          <Input type="date" value={editSkillDate} onChange={e => setEditSkillDate(e.target.value)} className="h-8 text-sm w-36" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="h-7 text-xs" onClick={() => handleSaveSkill(skill.id)}>
                          <Check className="h-3 w-3 mr-1" /> Save
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setEditingSkillId(null)}>
                          <X className="h-3 w-3 mr-1" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{skill.name}</span>
                          {skill.date && (
                            <span className="text-xs text-muted-foreground">· {skill.date}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-56">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${(skill.proficiency / 5) * 100}%`,
                                backgroundColor: PROF_COLORS[skill.proficiency],
                              }}
                            />
                          </div>
                          <span
                            className="text-xs font-medium shrink-0"
                            style={{ color: PROF_COLORS[skill.proficiency] }}
                          >
                            {skill.proficiency}/5 · {PROF_LABELS[skill.proficiency]}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => startEditSkill(skill)}>
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-destructive" onClick={() => handleDeleteSkill(skill.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
