"use client"
import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from 'clsx';
import { decode } from 'jsonwebtoken';
import Cookies from 'js-cookie';
import {
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Frame,
  House,
  LifeBuoy,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Send,
  Settings2,
  Share,
  Sparkles,
  SquareTerminal,
  Store,
  TerminalSquare,
  Trash2,
  User,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useRouter } from 'next/navigation';
const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
          title: "Inicio",
          url: "/dashboard",
          icon: TerminalSquare,
          isActive: true,
          roles: ["admin", "usuario", "recursos_humanos"], // Roles permitidos
          items: [
            {
              title: "Qr",
              url: "#",
              roles: ["admin", "recursos_humanos", "usuario"], // Roles permitidos para el sublink
            },
          ],
        },
        {
          title: "Personal",
          url: "#",
          icon: Bot,
          roles: ["admin", "recursos_humanos"], // Solo para admin y usuario
          items: [
            {
              title: "Lista",
              url: "/dashboard/recursoshumanos/employed/list",
              roles: ["admin", "recursos_humanos"],
            },

          ],
        },
        {
          title: "Configuracion",
          url: "#",
          icon: BookOpen,
          roles: ["admin"],
          items: [
            {
              title: "Zonas",
              url: "/dashboard/admin/zone",
              roles: ["admin"],
            },
            {
              title: "Crear zona",
              url: "/dashboard/admin/zone/create",
              roles: ["admin"],
            },
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




  export default function SideBarLinks() {
    const [role, setRole] = useState(null);
    const router = useRouter();
    const [user, setUser] =useState(null)

    const fetchUserDetails = async (userId) => {
  
      try {
        const response = await fetch(`/api/auth/info/user?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user details");
  
        const employeeData = await response.json();
        console.log(employeeData);
        setUser(employeeData);
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

  
    useEffect(() => {
      const token = Cookies.get("accessToken");
      const userId = Cookies.get("userId");
      if (token) {
        const decodedToken = decode(token);
        setRole(decodedToken?.role);
      }
      if(userId) {
        fetchUserDetails(userId)
      }
    }, []);
  
    if (!role) return null;
  
    // Filtra los enlaces y subenlaces según el rol del usuario
    const filteredNavMain = data.navMain
      .filter((link) => link.roles.includes(role)) // Solo los enlaces principales con el rol del usuario
      .map((link) => ({
        ...link,
        items: link.items?.filter((subItem) => subItem.roles.includes(role)), // Filtra subenlaces
      }));
  


      const handleLogout = async () => {
        try {
          const response = await fetch('/api/auth/logout');
          const data = await response.json();
          window.location.href = "/auth/login";
        } catch (error) {
          console.error("Error during logout:", error);
        }
      };
    return (
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="flex items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground p-2">
                    <Store className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Fichaqui</span>
                    <span className="truncate text-xs">Make You S.R.L.</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
  {filteredNavMain.map((item) => (
    <Collapsible key={item.title} asChild >
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <a href={item.url}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </a>
        </SidebarMenuButton>
        {item.items?.length > 0 && (
          <>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="data-[state=open]:rotate-90">
                <ChevronRight />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild>
                      <a href={subItem.url}>{subItem.title}</a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        )}
      </SidebarMenuItem>
    </Collapsible>
  ))}
</SidebarMenu>

          </SidebarGroup>
        </SidebarContent>
        {user ? (
        <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src=""
                      alt={user.firstName}
                    />
                    <AvatarFallback className="rounded-lg">{user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src=""
                        alt={user.firstName}
                      />
                      <AvatarFallback className="rounded-lg">
                      {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="truncate text-xs">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="hover:bg-gray-100">
                    <User  className='mr-1'/>
                    Account - Proximamente
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="hover:bg-gray-100">
                  <LogOut className='mr-1' />
                  Cerrar Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
        ):(
          <p>Cargando...</p>
          
        )}

      </Sidebar>
    );
  }