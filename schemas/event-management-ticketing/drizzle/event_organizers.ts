// event_organizers: Maps users to events with specific organizational roles.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { events } from "./events";
import { users } from "../../auth-rbac/drizzle/users";

export const organizerRoleEnum = pgEnum("organizer_role", [
  "owner",
  "admin",
  "moderator",
  "check_in_staff",
]);

export const eventOrganizers = pgTable(
  "event_organizers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: organizerRoleEnum("role").notNull().default("admin"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_event_organizers_event_id_user_id").on(
      table.eventId,
      table.userId,
    ),
    index("idx_event_organizers_user_id").on(table.userId),
  ],
);
