import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, EventEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Event, EventState, User, AttendeeStatus } from "@shared/types";
import { authMiddleware } from "./auth-middleware";
// Define a type for Hono's context that includes our custom variables
type AppContext = {
  Bindings: Env;
  Variables: {
    authUser: {
      sub: string;
      name?: string;
      nickname?: string;
      email: string;
      picture?: string;
    };
  };
};
export function userRoutes(app: Hono<AppContext>) {
  // Seed mock data for demo purposes
  app.use('/api/*', async (c, next) => {
    await UserEntity.ensureSeed(c.env);
    await next();
  });
  // Public route for login/signup sync
  app.post('/api/auth/sync', authMiddleware, async (c) => {
    const authUser = c.get('authUser');
    const userEntity = new UserEntity(c.env, authUser.sub);
    if (await userEntity.exists()) {
      const user = await userEntity.getState();
      return ok(c, user);
    }
    const newUser: User = {
      id: authUser.sub,
      name: authUser.name || authUser.nickname || 'New User',
      email: authUser.email,
      avatarUrl: authUser.picture,
    };
    await UserEntity.create(c.env, newUser);
    return ok(c, newUser);
  });
  // Secure all subsequent routes
  app.use('/api/*', authMiddleware);
  // USER ROUTES
  app.put('/api/users/:id', async (c) => {
    const authUser = c.get('authUser');
    const { id } = c.req.param();
    if (id !== authUser.sub) {
      return c.json({ success: false, error: 'Unauthorized' }, 403);
    }
    const { name, avatarUrl } = await c.req.json<{ name?: string; avatarUrl?: string }>();
    const fieldsToUpdate: Partial<User> = {};
    if (isStr(name)) fieldsToUpdate.name = name;
    if (isStr(avatarUrl)) fieldsToUpdate.avatarUrl = avatarUrl;
    if (Object.keys(fieldsToUpdate).length === 0) {
        return bad(c, 'No fields to update provided.');
    }
    const userEntity = new UserEntity(c.env, id);
    if (!await userEntity.exists()) return notFound(c, 'User not found');
    await userEntity.patch(fieldsToUpdate);
    const updatedUser = await userEntity.getState();
    return ok(c, updatedUser);
  });
  // EVENT ROUTES
  app.get('/api/events', async (c) => {
    const authUser = c.get('authUser');
    const user = await new UserEntity(c.env, authUser.sub).getState();
    const { items: allEventStates } = await EventEntity.list(c.env);
    const visibleEvents = allEventStates.filter(event =>
        event.creatorId === user.id || (event.invitedEmails && event.invitedEmails.includes(user.email))
    );
    const creatorIds = [...new Set(visibleEvents.map(e => e.creatorId))];
    const userPromises = creatorIds.map(id => new UserEntity(c.env, id).getState().catch(() => null));
    const userList = (await Promise.all(userPromises)).filter(Boolean) as User[];
    const users = new Map(userList.map(u => [u.id, u]));
    const events: Event[] = visibleEvents.map(eventState => {
      const creator = users.get(eventState.creatorId) || { id: eventState.creatorId, name: 'Unknown', email: '' };
      return { ...eventState, creator };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return ok(c, events);
  });
  app.get('/api/events/:id', async (c) => {
    const authUser = c.get('authUser');
    const user = await new UserEntity(c.env, authUser.sub).getState();
    const { id } = c.req.param();
    const eventEntity = new EventEntity(c.env, id);
    if (!await eventEntity.exists()) return notFound(c, 'Event not found');
    const eventState = await eventEntity.getState();
    const isCreator = eventState.creatorId === user.id;
    const isInvited = eventState.invitedEmails?.includes(user.email);
    if (!isCreator && !isInvited) {
        return notFound(c, 'Event not found or access denied');
    }
    const creator = await new UserEntity(c.env, eventState.creatorId).getState();
    const event: Event = { ...eventState, creator };
    return ok(c, event);
  });
  app.post('/api/events', async (c) => {
    const authUser = c.get('authUser');
    const user = await new UserEntity(c.env, authUser.sub).getState();
    const { title, description, date, location, imageUrl, invitedEmails } = await c.req.json<Omit<Event, 'id' | 'creator' | 'attendees'>>();
    if (!isStr(title) || !isStr(description) || !isStr(date) || !isStr(location) || !isStr(imageUrl)) {
      return bad(c, 'Missing required event fields');
    }
    const newEventState: EventState = {
      id: crypto.randomUUID(),
      title, description, date, location, imageUrl,
      creatorId: user.id,
      attendees: [{ ...user, status: 'going', adults: 1, kids: 0 }],
      invitedEmails: invitedEmails || [],
    };
    await EventEntity.create(c.env, newEventState);
    const event: Event = { ...newEventState, creator: user };
    return ok(c, event);
  });
  app.put('/api/events/:id', async (c) => {
    const authUser = c.get('authUser');
    const { id } = c.req.param();
    const { title, description, date, location, imageUrl, invitedEmails } = await c.req.json<Omit<Event, 'id' | 'creator' | 'attendees'>>();
    const eventEntity = new EventEntity(c.env, id);
    if (!await eventEntity.exists()) return notFound(c, 'Event not found');
    const currentEventState = await eventEntity.getState();
    if (currentEventState.creatorId !== authUser.sub) {
      return c.json({ success: false, error: 'Unauthorized' }, 403);
    }
    const user = await new UserEntity(c.env, authUser.sub).getState();
    const updatedFields = { title, description, date, location, imageUrl, invitedEmails };
    await eventEntity.patch(updatedFields);
    const updatedState = await eventEntity.getState();
    const event: Event = { ...updatedState, creator: user };
    return ok(c, event);
  });
  app.delete('/api/events/:id', async (c) => {
    const authUser = c.get('authUser');
    const { id } = c.req.param();
    const eventEntity = new EventEntity(c.env, id);
    if (!await eventEntity.exists()) return notFound(c, 'Event not found');
    const currentEventState = await eventEntity.getState();
    if (currentEventState.creatorId !== authUser.sub) {
      return c.json({ success: false, error: 'Unauthorized' }, 403);
    }
    const deleted = await EventEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  app.post('/api/events/:id/rsvp', async (c) => {
    const authUser = c.get('authUser');
    const { id } = c.req.param();
    const { status, adults, kids } = await c.req.json<{ status: AttendeeStatus; adults: number; kids: number }>();
    if (!isStr(status)) return bad(c, 'status is required');
    if (typeof adults !== 'number' || typeof kids !== 'number' || adults < 0 || kids < 0) {
        return bad(c, 'adults and kids must be non-negative numbers');
    }
    const eventEntity = new EventEntity(c.env, id);
    if (!await eventEntity.exists()) return notFound(c, 'Event not found');
    const user = await new UserEntity(c.env, authUser.sub).getState();
    if (!user) return bad(c, 'User not found');
    const updatedEventState = await eventEntity.mutate(eventState => {
      const attendees = eventState.attendees.filter(a => a.id !== user.id);
      attendees.push({ ...user, status, adults, kids });
      return { ...eventState, attendees };
    });
    const creator = await new UserEntity(c.env, updatedEventState.creatorId).getState();
    const event: Event = { ...updatedEventState, creator };
    return ok(c, event);
  });
}