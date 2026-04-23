import Link from "next/link"
import {
  ClipboardList,
  Briefcase,
  BookOpen,
  Lightbulb,
  Users,
  CheckSquare,
  ImageIcon,
  FileText,
  Sparkles,
} from "lucide-react"

const sections = [
  {
    group: "Business",
    items: [
      {
        label: "Business Partner Impact",
        description: "Track and document business partner work items and their impact.",
        href: "/dashboard/business-commitments",
        icon: ClipboardList,
        color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
        border: "hover:border-blue-300 dark:hover:border-blue-700",
      },
      {
        label: "AT&T / TDP Impact",
        description: "Log AT&T and TDP program impact commitment events.",
        href: "/dashboard/business-commitments-two",
        icon: Briefcase,
        color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400",
        border: "hover:border-indigo-300 dark:hover:border-indigo-700",
      },
    ],
  },
  {
    group: "Development",
    items: [
      {
        label: "Development Commitment #1",
        description: "Manage learning items and training modules.",
        href: "/dashboard/development-commitments-one",
        icon: BookOpen,
        color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
        border: "hover:border-emerald-300 dark:hover:border-emerald-700",
      },
      {
        label: "Innovation Commitment #2",
        description: "Track hackathons, symposiums, and innovation events.",
        href: "/dashboard/development-commitments-two",
        icon: Lightbulb,
        color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
        border: "hover:border-amber-300 dark:hover:border-amber-700",
      },
    ],
  },
  {
    group: "Other",
    items: [
      {
        label: "1-on-1 Documents",
        description: "Create and export structured 1-on-1 meeting records.",
        href: "/dashboard/one-on-one",
        icon: Users,
        color: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
        border: "hover:border-violet-300 dark:hover:border-violet-700",
      },
      {
        label: "Action Items",
        description: "Keep track of tasks and follow-ups with priority levels.",
        href: "/dashboard/action-items",
        icon: CheckSquare,
        color: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
        border: "hover:border-rose-300 dark:hover:border-rose-700",
      },
      {
        label: "Skills",
        description: "Log and organize your skills by proficiency level.",
        href: "/dashboard/skills",
        icon: Sparkles,
        color: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400",
        border: "hover:border-teal-300 dark:hover:border-teal-700",
      },
      {
        label: "Images",
        description: "Browse diagrams and screenshots from the public folder.",
        href: "/dashboard/images",
        icon: ImageIcon,
        color: "bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400",
        border: "hover:border-sky-300 dark:hover:border-sky-700",
      },
      {
        label: "Resume",
        description: "View or download your resume from the public resume folder.",
        href: "/dashboard/resume",
        icon: FileText,
        color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
        border: "hover:border-amber-300 dark:hover:border-amber-700",
      },
      {
        label: "TDP Docs",
        description: "View the full TDP program documentation reference.",
        href: "/docs/tdp",
        icon: FileText,
        color: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
        border: "hover:border-orange-300 dark:hover:border-orange-700",
      },
    ],
  },
]

export default function DashboardPage() {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div className="space-y-10">
      {/* Greeting */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{greeting}, Aman.</h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your commitment tracker. Select a section to get started.
        </p>
      </div>

      {/* Section grids */}
      {sections.map(({ group, items }) => (
        <div key={group} className="space-y-3">
          <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{group}</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map(({ label, description, href, icon: Icon, color, border }) => (
              <Link
                key={href}
                href={href}
                className={`group flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition-all duration-150 hover:shadow-md ${border}`}
              >
                <div className={`w-fit rounded-lg p-2.5 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="leading-snug font-semibold group-hover:underline">{label}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
