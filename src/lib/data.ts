import type { User, Child, Event, Booking } from './types';
import { BookOpen, Calendar, Presentation } from 'lucide-react';
import { add, set } from 'date-fns';

const today = new Date();

export const childrenData: Child[] = [
  { id: 'child1', name: 'Alex Smith', classId: 'classA' },
  { id: 'child2', name: 'Jamie Smith', classId: 'classC' },
  { id: 'child3', name: 'Ben Johnson', classId: 'classB' },
];

export const usersData: User[] = [
  { 
    id: 'parent1', 
    name: 'John Smith', 
    email: 'john.smith@example.com', 
    role: 'parent', 
    children: [childrenData[0], childrenData[1]] 
  },
  { 
    id: 'parent2', 
    name: 'Emily Johnson', 
    email: 'emily.j@example.com', 
    role: 'parent', 
    children: [childrenData[2]] 
  },
  { id: 'teacher1', name: 'Mrs. Davis', email: 'davis@school.com', role: 'teacher', classId: 'classA' },
  { id: 'teacher2', name: 'Mr. Wilson', email: 'wilson@school.com', role: 'teacher', classId: 'classB' },
  { id: 'teacher3', name: 'Ms. Taylor', email: 'taylor@school.com', role: 'teacher', classId: 'classC' },
  { id: 'admin1', name: 'Principal Thompson', email: 'principal@school.com', role: 'admin' },
];

const generateSlots = (date: Date, teacherIds: string[], startHour: number, endHour: number, slotDuration: number): Event['availableSlots'] => {
  const slots: Event['availableSlots'] = [];
  teacherIds.forEach(teacherId => {
    let currentTime = set(date, { hours: startHour, minutes: 0, seconds: 0, milliseconds: 0 });
    const endTime = set(date, { hours: endHour, minutes: 0, seconds: 0, milliseconds: 0 });

    while (currentTime < endTime) {
      slots.push({ startTime: new Date(currentTime), teacherId });
      currentTime = add(currentTime, { minutes: slotDuration });
    }
  });
  return slots;
};

const PTMDate = add(today, { days: 14 });
const OpenDayDate = add(today, { days: 7 });
const ActivityDate = add(today, { days: 21 });

export const eventsData: Event[] = [
  {
    id: 'event1',
    title: 'Parent-Teacher Meetings',
    description: 'Discuss your child\'s progress with their teachers.',
    date: PTMDate,
    type: 'Parent-Teacher Meeting',
    icon: BookOpen,
    image: 'https://picsum.photos/600/400?random=1',
    availableSlots: generateSlots(PTMDate, ['teacher1', 'teacher2', 'teacher3'], 9, 17, 30),
  },
  {
    id: 'event2',
    title: 'Annual School Open Day',
    description: 'Explore our campus, meet the staff, and see student work.',
    date: OpenDayDate,
    type: 'Open Day',
    icon: Calendar,
    image: 'https://picsum.photos/600/400?random=2',
    availableSlots: generateSlots(OpenDayDate, ['teacher1', 'teacher2'], 10, 15, 60),
  },
  {
    id: 'event3',
    title: 'Science Fair Showcase',
    description: 'A showcase of our students\' innovative science projects.',
    date: ActivityDate,
    type: 'Special Activity',
    icon: Presentation,
    image: 'https://picsum.photos/600/400?random=3',
    availableSlots: generateSlots(ActivityDate, ['teacher3'], 11, 14, 45),
  },
];

export const bookingsData: Booking[] = [
  {
    id: 'booking1',
    eventId: 'event1',
    parentId: 'parent1',
    childId: 'child1',
    teacherId: 'teacher1',
    startTime: set(PTMDate, { hours: 10, minutes: 30 }),
    endTime: set(PTMDate, { hours: 11, minutes: 0 }),
    status: 'confirmed',
  },
  {
    id: 'booking2',
    eventId: 'event1',
    parentId: 'parent2',
    childId: 'child3',
    teacherId: 'teacher2',
    startTime: set(PTMDate, { hours: 14, minutes: 0 }),
    endTime: set(PTMDate, { hours: 14, minutes: 30 }),
    status: 'confirmed',
  },
];
