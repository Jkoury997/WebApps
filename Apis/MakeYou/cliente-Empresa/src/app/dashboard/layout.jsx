// Component.js
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BarChart3, DollarSign, Package, Users, Search, Bell, Menu, X, ChevronDown, Settings, ShoppingCart, FileText, EggFriedIcon,UserRound, StoreIcon } from 'lucide-react';
import { NavLinks } from "@/components/ui/navlinks";
import { UserDropMenu } from '@/components/ui/user';

export default function Component({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title = process.env.NEXT_PUBLIC_EMPRESA_NAME

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Nueva función para cerrar el sidebar
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <aside className={`bg-white dark:bg-gray-800 w-64 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <Link className="flex items-center font-semibold" href="/dashboard">
              <StoreIcon className="mr-2 h-6 w-6" />
              <span>{title}</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
          <NavLinks onLinkClick={closeSidebar} /> {/* Pasamos la función closeSidebar */}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleSidebar}></div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden lg:pl-64">
        {/* Top bar */}
        <header className="flex h-14 items-center border-b bg-white dark:bg-gray-800 px-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center">
              <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 hidden" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="ml-2 w-full max-w-xs hidden"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="hidden">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <UserDropMenu></UserDropMenu>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4">
        {children} 
        </main>
      </div>
    </div>
  );
}
