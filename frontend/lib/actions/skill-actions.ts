"use server"

import { skillApi } from "@/lib/api"
import type { Skill } from "@/types/types"

export async function createSkill(data: Partial<Skill>) {
  return skillApi.create(data)
}

export async function updateSkill(id: number, data: Partial<Skill>) {
  return skillApi.update(id, data)
}

export async function deleteSkill(id: number) {
  return skillApi.delete(id)
}
