"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  PlusCircle,
  Star,
  Zap,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navItems = [
  {
    group: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    group: "Flashcards",
    items: [
      { href: "/dashboard/sets", label: "My Sets", icon: BookOpen },
      { href: "/dashboard/sets/new", label: "Create Set", icon: PlusCircle },
      { href: "/dashboard/starred", label: "Starred Cards", icon: Star },
    ],
  },
  {
    group: "Tracking",
    items: [
      { href: "/dashboard/skills", label: "Skills", icon: GraduationCap },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
            SF
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Spring Flash</span>
            <span className="text-xs text-muted-foreground">Study smarter</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navItems.map((section) => (
          <SidebarGroup key={section.group}>
            <SidebarGroupLabel>{section.group}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={item.href} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 py-2 text-xs text-muted-foreground flex items-center gap-1">
          <Zap className="h-3 w-3" />
          Spring Flash v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
