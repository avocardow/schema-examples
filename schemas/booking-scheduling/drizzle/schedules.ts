// schedules: named availability schedules assigned to providers.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { providers } from "./providers";

export const schedules = pgTable(
  "schedules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    providerId: uuid("provider_id").notNull().references(() => providers.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    timezone: text("timezone").notNull(),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_schedules_provider_id_is_default").on(table.providerId, table.isDefault),
  ]
);
