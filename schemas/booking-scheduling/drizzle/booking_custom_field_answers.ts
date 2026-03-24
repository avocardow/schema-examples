// booking_custom_field_answers: customer responses to custom intake fields for a booking.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { bookings } from "./bookings";
import { customFields } from "./custom_fields";

export const bookingCustomFieldAnswers = pgTable(
  "booking_custom_field_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
    customFieldId: uuid("custom_field_id").notNull().references(() => customFields.id, { onDelete: "cascade" }),
    value: text("value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_booking_custom_field_answers_booking_id_custom_field_id").on(table.bookingId, table.customFieldId),
    index("idx_booking_custom_field_answers_custom_field_id").on(table.customFieldId),
  ]
);
