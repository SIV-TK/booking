"use client";

import * as React from "react";
import Image from "next/image";
import { format, differenceInMinutes, addMinutes } from "date-fns";
import {
  ArrowRight,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { eventsData, bookingsData as initialBookings, usersData } from "@/lib/data";
import type { User as Parent, Event, Booking, Child, TimeSlot } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

interface ParentPortalProps {
  user: Parent;
}

export default function ParentPortal({ user }: ParentPortalProps) {
  const { toast } = useToast();
  const [bookings, setBookings] = React.useState<Booking[]>(initialBookings);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [selectedChild, setSelectedChild] = React.useState<string | undefined>(
    user.children?.[0]?.id
  );
  const [selectedSlot, setSelectedSlot] = React.useState<TimeSlot | null>(
    null
  );
  const [isBooking, setIsBooking] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );

  const parentBookings = bookings.filter((b) => b.parentId === user.id);
  const bookingsForSelectedDay = parentBookings.filter(
    (b) => format(b.startTime, "yyyy-MM-dd") === format(selectedDate || new Date(), "yyyy-MM-dd")
  ).sort((a,b) => a.startTime.getTime() - b.startTime.getTime());

  const bookedSlotTimes = React.useMemo(() => {
    return new Set(bookings.map((b) => b.startTime.getTime()));
  }, [bookings]);

  const handleBookSlot = () => {
    if (!selectedEvent || !selectedSlot || !selectedChild) return;

    setIsBooking(true);
    const newBookingStartTime = selectedSlot.startTime;
    const bookingDuration = selectedEvent.type === 'Open Day' ? 60 : 30;

    const conflict = parentBookings.some((existingBooking) => {
      const timeDiff = Math.abs(
        differenceInMinutes(newBookingStartTime, existingBooking.startTime)
      );
      return timeDiff < bookingDuration + 45;
    });

    if (conflict) {
      toast({
        variant: "destructive",
        title: "Booking Conflict",
        description:
          "You must leave at least a 45-minute gap between your bookings.",
      });
      setIsBooking(false);
      return;
    }

    // Simulate booking process
    setTimeout(() => {
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        eventId: selectedEvent.id,
        parentId: user.id,
        childId: selectedChild,
        teacherId: selectedSlot.teacherId,
        startTime: newBookingStartTime,
        endTime: addMinutes(newBookingStartTime, bookingDuration),
        status: "confirmed",
      };

      setBookings((prev) => [...prev, newBooking]);
      toast({
        title: "Booking Confirmed!",
        description: `Your appointment for ${selectedEvent.title} is set.`,
      });
      setIsBooking(false);
      setSelectedEvent(null);
      setSelectedSlot(null);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Parent Booking Portal</h1>
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">Book Events</TabsTrigger>
          <TabsTrigger value="schedule">My Schedule</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {eventsData.map((event) => (
              <Card key={event.id} className="flex flex-col">
                <CardHeader className="p-0">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={600}
                    height={400}
                    data-ai-hint="school event"
                    className="rounded-t-lg aspect-[3/2] object-cover"
                  />
                </CardHeader>
                <CardContent className="flex-grow p-6">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <event.icon className="w-5 h-5" />
                    <CardDescription className="font-semibold text-primary">
                      {event.type}
                    </CardDescription>
                  </div>
                  <CardTitle className="mb-2 font-headline">{event.title}</CardTitle>
                  <p className="text-muted-foreground text-sm flex-grow">
                    {event.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => setSelectedEvent(event)}
                    className="w-full"
                  >
                    Book Appointment <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="schedule">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="font-headline">My Confirmed Bookings</CardTitle>
              <CardDescription>View your schedule at a glance.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{ booked: parentBookings.map(b => b.startTime) }}
                  modifiersStyles={{ booked: {
                    color: 'hsl(var(--primary-foreground))',
                    backgroundColor: 'hsl(var(--primary))'
                  }}}
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">
                  Bookings for {format(selectedDate || new Date(), "PPP")}
                </h3>
                {bookingsForSelectedDay.length > 0 ? (
                  <ul className="space-y-4">
                    {bookingsForSelectedDay.map(booking => {
                        const event = eventsData.find(e => e.id === booking.eventId);
                        const child = user.children?.find(c => c.id === booking.childId);
                        const teacher = usersData.find(t => t.id === booking.teacherId);
                        return (
                           <li key={booking.id} className="p-4 rounded-lg border bg-card flex items-start gap-4">
                             <div className="bg-primary/10 text-primary p-2 rounded-full">
                               {event && <event.icon className="w-6 h-6"/>}
                             </div>
                             <div className="flex-grow">
                                <p className="font-semibold">{event?.title}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4"/>{format(booking.startTime, 'p')} - {format(booking.endTime, 'p')}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-2"><User className="w-4 h-4"/>For {child?.name} with {teacher?.name}</p>
                             </div>
                             <Badge variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
                               <CheckCircle className="w-3.5 h-3.5 mr-1"/>
                               Confirmed
                             </Badge>
                           </li>
                        )
                    })}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
                     <CalendarIcon className="w-12 h-12 text-muted-foreground mb-2"/>
                     <p className="font-semibold">No bookings for this day.</p>
                     <p className="text-sm text-muted-foreground">Select a day with a blue dot to see your bookings.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline">{selectedEvent.title}</DialogTitle>
              <DialogDescription>
                Select a child and an available time slot.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {user.children && user.children.length > 1 && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="child" className="text-right">
                    Child
                  </label>
                  <Select
                    value={selectedChild}
                    onValueChange={setSelectedChild}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a child" />
                    </SelectTrigger>
                    <SelectContent>
                      {user.children.map((child) => (
                        <SelectItem key={child.id} value={child.id}>
                          {child.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-4 items-start gap-4">
                <label className="text-right pt-2">Time</label>
                <div className="col-span-3 grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
                  {selectedEvent.availableSlots
                  .filter(slot => !bookedSlotTimes.has(slot.startTime.getTime()))
                  .map((slot) => (
                    <Button
                      key={slot.startTime.toISOString()}
                      variant={
                        selectedSlot?.startTime === slot.startTime
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {format(slot.startTime, "p")}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleBookSlot}
                disabled={!selectedSlot || !selectedChild || isBooking}
              >
                {isBooking ? "Booking..." : "Confirm Booking"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
