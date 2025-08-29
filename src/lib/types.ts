import type { LucideIcon } from 'lucide-react';

export type UserRole = 'parent' | 'teacher' | 'admin';

export interface Child {
  id: string;
  name: string;
  classId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  classId?: string;
  children?: Child[];
}

export interface TimeSlot {
  startTime: Date;
  teacherId: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'Open Day' | 'Parent-Teacher Meeting' | 'Special Activity';
  icon: LucideIcon;
  image: string;
  availableSlots: TimeSlot[];
}

export interface Booking {
  id: string;
  eventId: string;
  parentId: string;
  childId: string;
  teacherId: string;
  startTime: Date;
  endTime: Date;
  status: 'confirmed' | 'pending' | 'cancelled' | 'missed';
}
