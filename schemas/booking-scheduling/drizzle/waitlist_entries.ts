// waitlist_entries: customers waiting for availability on a specific service and date.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { services } from "./services";
import { providers } from "./providers";
import { users } from "./users";
import { locations } from "./locations";

export const waitlistStatusEnum = pgEnum("waitlist_status", [
  "waiting",
  "notified",
  "booked",
  "expired",
  "cancelled",
]);

export const waitlistEntries = pgTable(
  "waitlist_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
    providerId: uuid("provider_id").references(() => providers.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    locationId: uuid("location_id").references(() => locations.id, { onDelete: "set null" }),
    preferredDate: text("preferred_date").notNull(),
    preferredStart: text("preferred_start"),
    preferredEnd: text("preferred_end"),
    status: waitlistStatusEnum("status").notNull().default("waiting"),
    notifiedAt: timestamp("notified_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_waitlist_entries_service_id_preferred_date_status").on(table.serviceId, table.preferredDate, table.status),
    index("idx_waitlist_entries_customer_id_status").on(table.customerId, table.status),
    index("idx_waitlist_entries_status_notified_at").on(table.status, table.notifiedAt),
  ]
);
