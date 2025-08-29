
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usersData } from "@/lib/data";
import type { User } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";

export default function UserSelectionPage() {
  const [selectedUser, setSelectedUser] = React.useState<User>(usersData[0]);
  const router = useRouter();

  const handleUserChange = (userId: string) => {
    const user = usersData.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
    }
  };

  const handleLogin = () => {
    localStorage.setItem("currentUser", JSON.stringify(selectedUser));
    switch (selectedUser.role) {
      case "admin":
        router.push("/admin");
        break;
      case "teacher":
        router.push("/teacher");
        break;
      case "parent":
        router.push("/parent");
        break;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Welcome to SchoolWise Events</CardTitle>
          <CardDescription>Please select a user to simulate logging in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <Select value={selectedUser.id} onValueChange={handleUserChange}>
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {usersData.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={`https://i.pravatar.cc/40?u=${user.id}`}
                        />
                        <AvatarFallback>
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold">{user.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleLogin} className="w-full h-12 text-lg">
                Proceed to Dashboard <ArrowRight className="ml-2"/>
            </Button>
        </CardContent>
      </Card>
    </main>
  );
}
