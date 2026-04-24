import Link from "next/link"
import { setApi, skillApi } from "@/lib/api"
import type { FlashCardSet, Skill } from "@/types/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, PlusCircle, Repeat2 } from "lucide-react"

export default async function DashboardPage() {
  let sets: FlashCardSet[] = []
  let skills: Skill[] = []

  try {
    ;[sets, skills] = await Promise.all([setApi.list(), skillApi.list()])
  } catch {
    // backend may not be running
  }

  const totalCards = sets.reduce((acc, s) => acc + (s.cardCount ?? s.flashCards?.length ?? 0), 0)
  const totalStudy = sets.reduce((acc, s) => acc + (s.timesStudied ?? 0), 0)
  const recentSets = [...sets]
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
    .slice(0, 6)

  const stats = [
    { label: "Total Sets", value: sets.length, icon: BookOpen, href: "/dashboard/sets" },
    { label: "Total Cards", value: totalCards, icon: PlusCircle, href: "/dashboard/sets" },
    { label: "Study Sessions", value: totalStudy, icon: Repeat2, href: "/dashboard/sets" },
    { label: "Skills", value: skills.length, icon: GraduationCap, href: "/dashboard/skills" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back — here&apos;s your study overview.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Sets</h2>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/sets">View All</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/sets/new">
              <PlusCircle className="h-4 w-4 mr-1" /> New Set
            </Link>
          </Button>
        </div>
      </div>

      {recentSets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No sets yet. Create your first set!</p>
            <Button asChild>
              <Link href="/dashboard/sets/new">Create Set</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentSets.map((set) => (
            <Link key={set.id} href={`/dashboard/sets/${set.id}`}>
              <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base line-clamp-1">{set.title}</CardTitle>
                  {set.topic && (
                    <p className="text-xs text-muted-foreground">{set.topic}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {set.description ?? "No description"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{set.cardCount ?? set.flashCards?.length ?? 0} cards</span>
                    <span>{set.timesStudied} sessions</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
