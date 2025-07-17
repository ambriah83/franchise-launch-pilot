import { NavLink, useLocation } from "react-router-dom"
import { LayoutDashboard, Building2 } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, SidebarHeader } from "@/components/ui/sidebar"

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: Building2 },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const collapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="p-4">
          {!collapsed ? (
            <div>
              <h2 className="text-lg font-bold text-sidebar-foreground">Franchise Launch OS</h2>
              <p className="text-xs text-sidebar-foreground/70">v1.1 Enterprise</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                          : "hover:bg-accent hover:text-accent-foreground"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}