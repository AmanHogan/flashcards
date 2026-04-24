import type { FlashCard, FlashCardSet, Skill } from "@/types/types"

const BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
  (typeof process !== "undefined" && process.env.BACKEND_API) ||
  "http://localhost:8080"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`API error ${res.status}: ${text}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const setApi = {
  list: () => request<FlashCardSet[]>("/api/sets"),
  get: (id: number) => request<FlashCardSet>(`/api/sets/${id}`),
  search: (q: string) => request<FlashCardSet[]>(`/api/sets/search?q=${encodeURIComponent(q)}`),
  create: (data: Partial<FlashCardSet>) =>
    request<FlashCardSet>("/api/sets", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<FlashCardSet>) =>
    request<FlashCardSet>(`/api/sets/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/api/sets/${id}`, { method: "DELETE" }),
  study: (id: number) => request<FlashCardSet>(`/api/sets/${id}/study`, { method: "POST" }),
}

export const cardApi = {
  list: (setId: number) => request<FlashCard[]>(`/api/sets/${setId}/cards`),
  get: (setId: number, cardId: number) => request<FlashCard>(`/api/sets/${setId}/cards/${cardId}`),
  starred: (setId: number) => request<FlashCard[]>(`/api/sets/${setId}/cards/starred`),
  groups: (setId: number) => request<string[]>(`/api/sets/${setId}/cards/groups`),
  byGroup: (setId: number, name: string) =>
    request<FlashCard[]>(`/api/sets/${setId}/cards/group?name=${encodeURIComponent(name)}`),
  create: (setId: number, data: Partial<FlashCard>) =>
    request<FlashCard>(`/api/sets/${setId}/cards`, { method: "POST", body: JSON.stringify(data) }),
  createBulk: (setId: number, data: Partial<FlashCard>[]) =>
    request<FlashCard[]>(`/api/sets/${setId}/cards/bulk`, { method: "POST", body: JSON.stringify(data) }),
  update: (setId: number, cardId: number, data: Partial<FlashCard>) =>
    request<FlashCard>(`/api/sets/${setId}/cards/${cardId}`, { method: "PUT", body: JSON.stringify(data) }),
  toggleStar: (setId: number, cardId: number) =>
    request<FlashCard>(`/api/sets/${setId}/cards/${cardId}/star`, { method: "PATCH" }),
  delete: (setId: number, cardId: number) =>
    request<void>(`/api/sets/${setId}/cards/${cardId}`, { method: "DELETE" }),
}

export const skillApi = {
  list: () => request<Skill[]>("/api/skills"),
  get: (id: number) => request<Skill>(`/api/skills/${id}`),
  bySet: (setId: number) => request<Skill[]>(`/api/skills/set/${setId}`),
  create: (data: Partial<Skill>) =>
    request<Skill>("/api/skills", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Skill>) =>
    request<Skill>(`/api/skills/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/api/skills/${id}`, { method: "DELETE" }),
}
