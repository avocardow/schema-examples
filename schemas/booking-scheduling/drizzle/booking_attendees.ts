// booking_attendees: individual participants attached to a booking.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { bookings } from "./bookings";
import { users } from "./users";

export const attendeeStatusEnum = pgEnum("attendee_status", ["confirmed", "cancelled", "no_show"]);

export const bookingAttendees = pgTable(
  "booking_attendees",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    status: attendeeStatusEnum("status").notNull().default("confirmed"),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_booking_attendees_booking_id").on(table.bookingId),
    index("idx_booking_attendees_user_id").on(table.userId),
    index("idx_booking_attendees_email").on(table.email),
  ]
);
