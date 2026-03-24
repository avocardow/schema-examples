// booking_reminders: scheduled notification reminders for upcoming bookings.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, integer, timestamp, index } from "drizzle-orm/pg-core";
import { bookings } from "./bookings";

export const reminderTargetEnum = pgEnum("reminder_target", ["customer", "provider", "all"]);

export const reminderStatusEnum = pgEnum("reminder_status", ["pending", "sent", "failed", "cancelled"]);

export const bookingReminders = pgTable(
  "booking_reminders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
    remindAt: timestamp("remind_at", { withTimezone: true }).notNull(),
    type: reminderTargetEnum("type").notNull().default("customer"),
    offsetMinutes: integer("offset_minutes").notNull(),
    status: reminderStatusEnum("status").notNull().default("pending"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_booking_reminders_booking_id").on(table.bookingId),
    index("idx_booking_reminders_status_remind_at").on(table.status, table.remindAt),
  ]
);
