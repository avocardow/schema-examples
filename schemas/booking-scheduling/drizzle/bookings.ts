// bookings: core appointment records linking customers to providers at a time and place.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { providers } from "./providers";
import { locations } from "./locations";
import { users } from "./users";
import { schedules } from "./schedules";

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "declined",
  "no_show",
]);

export const bookingSourceEnum = pgEnum("booking_source", ["online", "manual", "api", "import"]);

export const bookingPaymentStatusEnum = pgEnum("booking_payment_status", [
  "not_required",
  "pending",
  "paid",
  "refunded",
  "partially_refunded",
]);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    providerId: uuid("provider_id").notNull().references(() => providers.id, { onDelete: "restrict" }),
    locationId: uuid("location_id").references(() => locations.id, { onDelete: "set null" }),
    customerId: uuid("customer_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    scheduleId: uuid("schedule_id").references(() => schedules.id, { onDelete: "set null" }),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),
    timezone: text("timezone").notNull(),
    status: bookingStatusEnum("status").notNull().default("pending"),
    cancelledBy: uuid("cancelled_by").references(() => users.id, { onDelete: "set null" }),
    cancellationReason: text("cancellation_reason"),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    customerNotes: text("customer_notes"),
    providerNotes: text("provider_notes"),
    source: bookingSourceEnum("source").notNull().default("online"),
    paymentStatus: bookingPaymentStatusEnum("payment_status").notNull().default("not_required"),
    recurrenceGroupId: uuid("recurrence_group_id"),
    recurrenceRule: text("recurrence_rule"),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_bookings_provider_id_start_time").on(table.providerId, table.startTime),
    index("idx_bookings_customer_id_start_time").on(table.customerId, table.startTime),
    index("idx_bookings_status").on(table.status),
    index("idx_bookings_start_time_end_time").on(table.startTime, table.endTime),
    index("idx_bookings_location_id").on(table.locationId),
    index("idx_bookings_recurrence_group_id").on(table.recurrenceGroupId),
  ]
);
