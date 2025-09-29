// This file is for shared types between the client and server.
// A generic API response format
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type AttendeeStatus = 'going' | 'maybe' | 'not_going';
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}
export interface Attendee extends User {
  status: AttendeeStatus;
  adults: number;
  kids: number;
}
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO 8601 string
  location: string;
  imageUrl: string;
  creator: User;
  attendees: Attendee[];
  invitedEmails?: string[];
}
// For backend entity state
export type EventState = Omit<Event, 'creator'> & { creatorId: string };