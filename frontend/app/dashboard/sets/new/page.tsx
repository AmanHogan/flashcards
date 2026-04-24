"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { setApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, GripVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CardRow {
  term: string
  definition: string
  groupName: string
  hint: string
}

export default function NewSetPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [topic, setTopic] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [cards, setCards] = useState<CardRow[]>([
    { term: "", definition: "", groupName: "", hint: "" },
    { term: "", definition: "", groupName: "", hint: "" },
  ])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function addTag() {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput("")
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
  }

  function addCard() {
    setCards([...cards, { term: "", definition: "", groupName: "", hint: "" }])
  }

  function removeCard(i: number) {
    setCards(cards.filter((_, idx) => idx !== i))
  }

  function updateCard(i: number, field: keyof CardRow, value: string) {
    const next = [...cards]
    next[i] = { ...next[i], [field]: value }
    setCards(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError("Title is required"); return }
    setSaving(true)
    setError("")
    try {
      const validCards = cards.filter(c => c.term.trim() && c.definition.trim())
      const set = await setApi.create({
        title: title.trim(),
        description: description.trim() || undefined,
        topic: topic.trim() || undefined,
        tags,
        flashCards: validCards.map((c, i) => ({
          term: c.term,
          definition: c.definition,
          groupName: c.groupName || undefined,
          hint: c.hint || undefined,
          sortOrder: i,
          starred: false,
        })),
      })
      router.push(`/dashboard/sets/${set.id}`)
    } catch (err: any) {
      setError(err.message ?? "Failed to create set")
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Set</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Set Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Biology Ch. 5" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" rows={2} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="topic">Topic / Subject</Label>
              <Input id="topic" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Biology" />
            </div>
            <div className="space-y-1">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
                  placeholder="Add tag and press Enter"
                />
                <Button type="button" variant="outline" onClick={addTag}>Add</Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map(t => (
                    <Badge key={t} variant="secondary" className="cursor-pointer" onClick={() => removeTag(t)}>
                      {t} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Cards ({cards.length})</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addCard}>
                <Plus className="h-4 w-4 mr-1" /> Add Card
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {cards.map((card, i) => (
              <div key={i} className="border rounded-lg p-3 space-y-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground font-medium">Card {i + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeCard(i)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Term</Label>
                    <Textarea
                      value={card.term}
                      onChange={e => updateCard(i, "term", e.target.value)}
                      placeholder="Term"
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Definition</Label>
                    <Textarea
                      value={card.definition}
                      onChange={e => updateCard(i, "definition", e.target.value)}
                      placeholder="Definition"
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Group (optional)</Label>
                    <Input
                      value={card.groupName}
                      onChange={e => updateCard(i, "groupName", e.target.value)}
                      placeholder="e.g. Chapter 1"
                      className="text-sm h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Hint (optional)</Label>
                    <Input
                      value={card.hint}
                      onChange={e => updateCard(i, "hint", e.target.value)}
                      placeholder="Optional hint"
                      className="text-sm h-8"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create Set"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
