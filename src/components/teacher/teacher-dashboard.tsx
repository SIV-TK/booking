"use client";

import * as React from "react";
import { format } from "date-fns";
import { BookOpen, CalendarDays, Clock, User as UserIcon } from "lucide-react";

import { usersData, bookingsData, eventsData } from "@/lib/data";
import type { User, Booking } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AiSummary from "../ai-summary";

interface TeacherDashboardProps {
  user: User;
}

export default function TeacherDashboard({ user }: TeacherDashboardProps) {
  const teacherBookings = bookingsData
    .filter((booking) => booking.teacherId === user.id)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Teacher Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Upcoming Appointments</CardTitle>
                    <CardDescription>
                        Here are your scheduled meetings with parents.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Parent</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead>Date & Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teacherBookings.length > 0 ? (
                                teacherBookings.map((booking) => {
                                    const parent = usersData.find(u => u.id === booking.parentId);
                                    const student = parent?.children?.find(c => c.id === booking.childId);
                                    const event = eventsData.find(e => e.id === booking.eventId);
                                    return (
                                        <TableRow key={booking.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarImage src={`https://i.pravatar.cc/40?u=${parent?.id}`} />
                                                        <AvatarFallback>{parent?.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{parent?.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{student?.name}</TableCell>
                                            <TableCell>{event?.title}</TableCell>
                                            <TableCell>{format(booking.startTime, "PPP, p")}</TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No upcoming appointments.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">My Class</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <UserIcon className="w-5 h-5 text-muted-foreground" />
                        <span className="font-semibold">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-muted-foreground" />
                        <span>Class {user.classId?.replace('class','')}</span>
                    </div>
                     <div className="flex items-center gap-3">
                        <CalendarDays className="w-5 h-5 text-muted-foreground" />
                        <span>{teacherBookings.length} appointments scheduled</span>
                    </div>
                </CardContent>
            </Card>
            <AiSummary bookings={bookingsData} events={eventsData} users={usersData} />
        </div>
      </div>
    </div>
  );
}
