// locale_settings: Per-locale formatting and regional settings.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { locales } from "./locales";

export const localeSettings = pgTable(
  "locale_settings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    localeId: uuid("locale_id")
      .unique()
      .notNull()
      .references(() => locales.id, { onDelete: "cascade" }),
    dateFormat: text("date_format"),
    timeFormat: text("time_format"),
    numberFormat: text("number_format"),
    currencyCode: text("currency_code"),
    currencySymbol: text("currency_symbol"),
    firstDayOfWeek: integer("first_day_of_week").notNull().default(1),
    measurementSystem: text("measurement_system"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  }
);
