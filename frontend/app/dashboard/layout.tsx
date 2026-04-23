import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 px-8 py-8">
          <SidebarTrigger />
          <div className="min-h-[calc(100vh-4rem)] w-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
