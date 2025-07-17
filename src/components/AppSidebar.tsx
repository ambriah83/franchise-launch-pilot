import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Building2,
  ShoppingCart,
  Package,
  Truck,
  FileText,
  Users,
  Warehouse,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Building2,
  },
]

const operationsNavItems = [
  {
    title: "Purchase Orders",
    url: "/purchase-orders",
    icon: ShoppingCart,
    subItems: [
      { title: "All Orders", url: "/purchase-orders" },
      { title: "Create Order", url: "/purchase-orders/create" },
      { title: "Templates", url: "/purchase-orders/templates" },
    ]
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Package,
    subItems: [
      { title: "Stock Levels", url: "/inventory" },
      { title: "Catalog", url: "/inventory/catalog" },
      { title: "Alerts", url: "/inventory/alerts" },
    ]
  },
  {
    title: "Receiving",
    url: "/receiving",
    icon: Truck,
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: FileText,
  },
]

const managementNavItems = [
  {
    title: "Suppliers",
    url: "/suppliers",
    icon: Users,
  },
  {
    title: "Warehouses",
    url: "/warehouses",
    icon: Warehouse,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true
    if (path !== "/" && currentPath.startsWith(path)) return true
    return false
  }

  const getNavClasses = (path: string) => {
    const baseClasses = "transition-colors"
    return isActive(path) 
      ? `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90` 
      : `${baseClasses} hover:bg-accent hover:text-accent-foreground`
  }

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Purchase Orders": true,
    "Inventory": true,
  })

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const hasActiveSubItem = (item: any) => {
    return item.subItems?.some((subItem: any) => isActive(subItem.url))
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
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operationsNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <Collapsible
                      open={openSections[item.title] || hasActiveSubItem(item)}
                      onOpenChange={() => toggleSection(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className={getNavClasses(item.url)}>
                          <item.icon className="h-4 w-4" />
                          {!collapsed && (
                            <>
                              <span>{item.title}</span>
                              {openSections[item.title] || hasActiveSubItem(item) ? (
                                <ChevronDown className="ml-auto h-4 w-4" />
                              ) : (
                                <ChevronRight className="ml-auto h-4 w-4" />
                              )}
                            </>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!collapsed && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <NavLink 
                                    to={subItem.url} 
                                    className={getNavClasses(subItem.url)}
                                  >
                                    <span>{subItem.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClasses(item.url)}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
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