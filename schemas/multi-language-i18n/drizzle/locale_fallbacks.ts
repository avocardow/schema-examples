// locale_fallbacks: Fallback chain configuration for locales.
// See README.md for full design rationale.

import { pgTable, uuid, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { locales } from "./locales";

export const localeFallbacks = pgTable(
  "locale_fallbacks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    localeId: uuid("locale_id")
      .notNull()
      .references(() => locales.id, { onDelete: "cascade" }),
    fallbackLocaleId: uuid("fallback_locale_id")
      .notNull()
      .references(() => locales.id, { onDelete: "cascade" }),
    priority: integer("priority").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("uq_locale_fallbacks_locale_id_fallback_locale_id").on(
      table.localeId,
      table.fallbackLocaleId
    ),
    unique("uq_locale_fallbacks_locale_id_priority").on(
      table.localeId,
      table.priority
    ),
  ]
);
