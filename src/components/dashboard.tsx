"use client";

import * as React from "react";
import Image from "next/image";
import {
  BookOpenCheck,
  ClipboardList,
  LayoutDashboard,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { usersData } from "@/lib/data";
import type { User } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import ParentPortal from "@/components/parent/parent-portal";
import TeacherDashboard from "@/components/teacher/teacher-dashboard";
import AdminPanel from "@/components/admin/admin-panel";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Dashboard() {
  const [currentUser, setCurrentUser] = React.useState<User>(usersData[0]);
  const [activeView, setActiveView] = React.useState("dashboard");

  const handleUserChange = (userId: string) => {
    const user = usersData.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setActiveView("dashboard");
    }
  };

  const renderContent = () => {
    switch (currentUser.role) {
      case "parent":
        return <ParentPortal user={currentUser} />;
      case "teacher":
        return <TeacherDashboard user={currentUser} />;
      case "admin":
        return <AdminPanel user={currentUser} />;
      default:
        return (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              Select a user to begin.
            </p>
          </div>
        );
    }
  };

  const menuItems = {
    parent: [
      { id: "dashboard", label: "Booking Portal", icon: LayoutDashboard },
    ],
    teacher: [
      { id: "dashboard", label: "My Dashboard", icon: ClipboardList },
    ],
    admin: [{ id: "dashboard", label: "Admin Overview", icon: Users }],
  };

  return (
    <SidebarProvider>
      <Sidebar>
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
            {menuItems[currentUser.role].map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => setActiveView(item.id)}
                  isActive={activeView === item.id}
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
          <div className="flex flex-col gap-2 p-2">
            <label className="text-xs text-muted-foreground px-2">
              Switch User (Login Sim)
            </label>
            <Select value={currentUser.id} onValueChange={handleUserChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {usersData.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage
                          src={`https://i.pravatar.cc/40?u=${user.id}`}
                        />
                        <AvatarFallback>
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        ({user.role})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
