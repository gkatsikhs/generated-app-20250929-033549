import { IndexedEntity } from "./core-utils";
import type { User, EventState } from "@shared/types";
const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Alex Starr', email: 'alex@eventide.app', avatarUrl: 'https://i.pravatar.cc/150?u=alexstarr' },
  { id: 'user-2', name: 'Casey Jordan', email: 'casey@eventide.app', avatarUrl: 'https://i.pravatar.cc/150?u=caseyjordan' },
  { id: 'user-3', name: 'Riley Quinn', email: 'riley@eventide.app', avatarUrl: 'https://i.pravatar.cc/150?u=rileyquinn' },
  { id: 'user-4', name: 'Morgan Lee', email: 'morgan@eventide.app', avatarUrl: 'https://i.pravatar.cc/150?u=morganlee' },
  { id: 'user-5', name: 'Jamie Lane', email: 'jamie@eventide.app', avatarUrl: 'https://i.pravatar.cc/150?u=jamielane' },
];
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "eventide-user";
  static readonly indexName = "eventide-users";
  static readonly initialState: User = { id: "", name: "", email: "" };
  static seedData = MOCK_USERS;
}
export class EventEntity extends IndexedEntity<EventState> {
  static readonly entityName = "eventide-event";
  static readonly indexName = "eventide-events";
  static readonly initialState: EventState = {
    id: "",
    title: "",
    description: "",
    date: "",
    location: "",
    imageUrl: "",
    creatorId: "",
    attendees: [],
    invitedEmails: []
  };
}