export interface FlashCard {
  id: number
  term: string
  definition: string
  sortOrder: number
  groupName?: string
  termImageUrl?: string
  definitionImageUrl?: string
  hint?: string
  starred: boolean
}

export interface FlashCardSet {
  id: number
  title: string
  description?: string
  topic?: string
  ownerId?: string
  tags?: string[]
  flashCards: FlashCard[]
  timesStudied: number
  createdAt?: string
  updatedAt?: string
  cardCount?: number
}

export interface Skill {
  id: number
  name: string
  proficiency: number  // 1-5
  date?: string
  flashCardSetId?: number
  flashCardSetTitle?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateSkillDTO {
  name: string
  proficiency: number
  date?: string
  flashCardSetId?: number
}

export function emptySkillForm(): CreateSkillDTO {
  return {
    name: "",
    proficiency: 3,
  }
}
