import { setApi, cardApi, skillApi } from "@/lib/api"
import type { FlashCardSet, FlashCard, Skill } from "@/types/types"
import { SetDetailClient } from "@/components/set-detail-client"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function SetDetailPage({ params }: Props) {
  const { id } = await params
  const setId = Number(id)

  let set: FlashCardSet
  let skills: Skill[] = []

  try {
    set = await setApi.get(setId)
    skills = await skillApi.bySet(setId)
  } catch {
    notFound()
  }

  return <SetDetailClient set={set!} skills={skills} />
}
