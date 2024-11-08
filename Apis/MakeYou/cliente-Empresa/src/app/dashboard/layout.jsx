"use client";

import { AppSidebar } from "@/components/component/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        {/* Sidebar y Contenido Principal */}
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 items-center gap-2 p-4 border-b border-gray-200 bg-white">
            <SidebarTrigger className="mr-2" />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Main Content */}
          <main className="min-h-[100vh] flex-1 bg-gray-100 p-1">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      
      {/* Toaster - Siempre visible en la parte inferior de la pantalla */}
      <Toaster />
    </>
  );
}