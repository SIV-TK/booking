"use client";

import * as React from "react";
import { format } from "date-fns";
import { BookOpenCheck, Calendar, Users } from "lucide-react";

import { usersData, bookingsData, eventsData } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AiSummary from "../ai-summary";

export default function AdminPanel() {
  const sortedBookings = [...bookingsData].sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Admin Control Panel</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BookOpenCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingsData.length}</div>
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersData.length}</div>
            <p className="text-xs text-muted-foreground">Parents, Teachers, and Admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventsData.length}</div>
            <p className="text-xs text-muted-foreground">Upcoming school events</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">All Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBookings.map((booking) => {
                    const event = eventsData.find((e) => e.id === booking.eventId);
                    const parent = usersData.find((u) => u.id === booking.parentId);
                    const teacher = usersData.find((u) => u.id === booking.teacherId);
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{event?.title}</TableCell>
                        <TableCell>{parent?.name}</TableCell>
                        <TableCell>{teacher?.name}</TableCell>
                        <TableCell>{format(booking.startTime, "Pp")}</TableCell>
                        <TableCell>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                                 className={booking.status === 'confirmed' ? 'bg-accent text-accent-foreground' : ''}
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
            <AiSummary bookings={bookingsData} events={eventsData} users={usersData} />
        </div>
      </div>
    </div>
  );
}
