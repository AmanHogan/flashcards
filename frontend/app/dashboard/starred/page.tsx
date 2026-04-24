import { setApi, cardApi } from "@/lib/api"
import type { FlashCardSet, FlashCard } from "@/types/types"
import { StarredCardsClient } from "@/components/starred-cards-client"

export default async function StarredPage() {
  let sets: FlashCardSet[] = []
  const starredBySet: { set: FlashCardSet; cards: FlashCard[] }[] = []

  try {
    sets = await setApi.list()
    await Promise.all(
      sets.map(async (set) => {
        try {
          const cards = await cardApi.starred(set.id)
          if (cards.length > 0) {
            starredBySet.push({ set, cards })
          }
        } catch {}
      })
    )
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Starred Cards</h1>
        <p className="text-muted-foreground">
          {starredBySet.reduce((acc, g) => acc + g.cards.length, 0)} starred cards across{" "}
          {starredBySet.length} sets
        </p>
      </div>
      <StarredCardsClient groups={starredBySet} />
    </div>
  )
}
