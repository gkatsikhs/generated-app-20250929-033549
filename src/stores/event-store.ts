import { create } from 'zustand';
import type { Event, AttendeeStatus } from '@shared/types';
import { api } from '@/lib/api-client';
type EventUpdatePayload = Omit<Event, 'id' | 'creator' | 'attendees' | 'invitedEmails'> & { invitedEmails?: string[] };
interface RsvpPayload {
  status: AttendeeStatus;
  adults: number;
  kids: number;
}
interface EventState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  getEventById: (id: string) => Event | undefined;
  addEvent: (event: EventUpdatePayload) => Promise<Event>;
  updateEvent: (id: string, event: EventUpdatePayload) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  rsvp: (eventId: string, payload: RsvpPayload) => Promise<void>;
}
export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,
  fetchEvents: async () => {
    if (get().isLoading) return; // Prevent concurrent fetches
    set({ isLoading: true, error: null });
    try {
      const events = await api<Event[]>('/api/events');
      set({ events, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  getEventById: (id: string) => get().events.find((event) => event.id === id),
  addEvent: async (newEventData) => {
    const newEvent = await api<Event>('/api/events', {
      method: 'POST',
      body: JSON.stringify(newEventData),
    });
    set((state) => ({ events: [newEvent, ...state.events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) }));
    return newEvent;
  },
  updateEvent: async (id, eventData) => {
    const updatedEvent = await api<Event>(`/api/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(eventData),
    });
    set(state => ({
        events: state.events.map(e => e.id === id ? updatedEvent : e).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }));
    return updatedEvent;
  },
  deleteEvent: async (id: string) => {
    await api(`/api/events/${id}`, { method: 'DELETE' });
    set(state => ({
        events: state.events.filter(e => e.id !== id)
    }));
  },
  rsvp: async (eventId: string, payload: RsvpPayload) => {
    const updatedEvent = await api<Event>(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    set(state => ({
        events: state.events.map(e => e.id === eventId ? updatedEvent : e)
    }));
  }
}));