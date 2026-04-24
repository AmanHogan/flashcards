import { setApi } from "@/lib/api"
import type { FlashCardSet } from "@/types/types"
import { SetsListClient } from "@/components/sets-list-client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function SetsPage() {
  let sets: FlashCardSet[] = []
  try {
    sets = await setApi.list()
  } catch {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Sets</h1>
          <p className="text-muted-foreground">{sets.length} sets total</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/sets/new">
            <PlusCircle className="h-4 w-4 mr-1" /> New Set
          </Link>
        </Button>
      </div>
      <SetsListClient initialSets={sets} />
    </div>
  )
}
