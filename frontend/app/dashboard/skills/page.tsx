import { skillApi, setApi } from "@/lib/api"
import type { Skill, FlashCardSet } from "@/types/types"
import { SkillsPage } from "@/components/skills-page"

export default async function SkillsPageRoute() {
  let skills: Skill[] = []
  let sets: FlashCardSet[] = []

  try {
    ;[skills, sets] = await Promise.all([skillApi.list(), setApi.list()])
  } catch {}

  return <SkillsPage initialSkills={skills} sets={sets} />
}
