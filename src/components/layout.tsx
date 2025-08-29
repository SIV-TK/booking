
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  BookOpenCheck,
  ClipboardList,
  LayoutDashboard,
  Users,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarProvider,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  const menuItems = {
    parent: [
      { id: "dashboard", label: "Booking Portal", icon: LayoutDashboard, href: "/parent" },
    ],
    teacher: [
      { id: "dashboard", label: "My Dashboard", icon: ClipboardList, href: "/teacher" },
    ],
    admin: [{ id: "dashboard", label: "Admin Overview", icon: Users, href: "/admin" }],
  };

  const renderSidebarContent = () => {
    if (loading || !user) {
      return (
        <>
          <SidebarHeader>
             <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex flex-col gap-1">
                    <Skeleton className="w-32 h-4" />
                </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Skeleton className="h-8 w-full" />
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </>
      );
    }

    return (
      <>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <BookOpenCheck className="size-8 text-primary" />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold font-headline">
                SchoolWise Events
              </h2>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems[user.role].map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => router.push(item.href)}
                  isActive={true}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col gap-3 p-2 border-t border-sidebar-border">
            <div className="flex items-center gap-3 p-2">
                 <Avatar className="w-10 h-10">
                    <AvatarImage
                    src={`https://i.pravatar.cc/40?u=${user.id}`}
                    />
                    <AvatarFallback>
                    {user.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold">{user.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                </div>
            </div>
            <SidebarMenuButton variant="outline" onClick={handleLogout} className="w-full justify-center">
              <LogOut />
              <span>Log Out</span>
            </SidebarMenuButton>
          </div>
        </SidebarFooter>
      </>
    );
  };

  return (
    <SidebarProvider>
      <Sidebar>
        {renderSidebarContent()}
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
