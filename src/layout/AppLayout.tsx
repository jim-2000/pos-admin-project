import { Outlet, Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { AppSidebar, WithSidebarProvider } from "@/components/layout/AppSidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export default function AppLayout() {
  return (
    <WithSidebarProvider>
      <div className="flex w-full min-h-screen interactive-glow rounded-xl"
              onMouseMove={(e) => {
                // const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                // const x = e.clientX - r.left
                // const y = e.clientY - r.top
                // ;(e.currentTarget as HTMLDivElement).style.setProperty('--x', `${x}px`)
                // ;(e.currentTarget as HTMLDivElement).style.setProperty('--y', `${y}px`)
              }}
      >
        <AppSidebar />
        <SidebarInset>
          <Helmet>
            <title>POS Admin Dashboard</title>
            <meta name="description" content="Admin dashboard to manage POS: sales, products, users, payments." />
            <link rel="canonical" href="/" />
          </Helmet>

          <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b">
            <div className="container flex h-14 items-center gap-3">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-gradient-primary" />
                <span className="font-semibold">POS Admin</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button asChild variant="hero" size="sm">
                  <Link to="/pos">Open POS</Link>
                </Button>
              </div>
            </div>
          </header>

          <main className="container py-6">
            <div>
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </WithSidebarProvider>
  )
}
