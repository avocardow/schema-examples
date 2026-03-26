// waitlist_entries: Queue of users waiting for ticket availability on sold-out events.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { events } from "./events";
import { ticketTypes } from "./ticket_types";
import { users } from "../../auth-rbac/drizzle/users";

export const waitlistStatusEnum = pgEnum("waitlist_status", [
  "waiting",
  "notified",
  "converted",
  "expired",
  "cancelled",
]);

export const waitlistEntries = pgTable(
  "waitlist_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    ticketTypeId: uuid("ticket_type_id").references(() => ticketTypes.id, {
      onDelete: "cascade",
    }),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    quantity: integer("quantity").notNull().default(1),
    status: waitlistStatusEnum("status").notNull().default("waiting"),
    notifiedAt: timestamp("notified_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_waitlist_entries_event_ticket_status").on(
      table.eventId,
      table.ticketTypeId,
      table.status,
    ),
    index("idx_waitlist_entries_user_id").on(table.userId),
    index("idx_waitlist_entries_email_status").on(table.email, table.status),
    index("idx_waitlist_entries_status_notified_at").on(
      table.status,
      table.notifiedAt,
    ),
  ],
);
