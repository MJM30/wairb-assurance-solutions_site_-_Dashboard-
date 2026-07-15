import { ReactNode } from "react"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Files, 
  Image as ImageIcon, 
  Newspaper, 
  Users, 
  Settings,
  LogOut,
  Menu
} from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const navItems = [
    { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { label: "Pages", href: "/dashboard/pages", icon: Files },
    { label: "Médias", href: "/dashboard/media", icon: ImageIcon },
    { label: "Actualités", href: "/dashboard/news", icon: Newspaper },
    { label: "Utilisateurs", href: "/dashboard/users", icon: Users },
    { label: "Paramètres", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-bold">W</span>
            </div>
            <span className="text-lg">Wairb CMS</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col sm:gap-4 sm:py-4 md:pl-0">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
          <button className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </button>
          <div className="font-semibold">Wairb CMS</div>
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  )
}
