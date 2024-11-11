"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LayoutList,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  StoreIcon,
} from "lucide-react"

import { NavMain } from "@/components/component/sidebar/nav-main"
import { NavProjects } from "@/components/component/sidebar/nav-projects"
import { NavSecondary } from "@/components/component/sidebar/nav-secondary"
import { NavUser } from "@/components/component/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"



export function AppSidebar({ ...props }) {


  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Gerencia",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Ventas",
            url: "/gerencia/tiendas/variables",
          },

        ],
      },
      {
        title: "Mantenimiento",
        url: "#",
        icon: LayoutList,
        items: [
          {
            title: "Tareas",
            url: "/mantenimiento/tareas/listado",
          },

        ],
      },
     
      {
        title: "Tiendas",
        url: "#",
        icon: StoreIcon,
        items: [
          {
            title: "Envio a Tienda",
            url: "/tienda/envio-a-tienda/selector",
          }
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <StoreIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Make You </span>
                  <span className="truncate text-xs">Empresa</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
         {/*<NavProjects projects={data.projects} />*/}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
