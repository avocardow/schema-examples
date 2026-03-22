// locales: Supported language/region locales for the i18n system.
// See README.md for full design rationale.

import { pgEnum, pgTable, uuid, text, timestamp, boolean, integer, index } from "drizzle-orm/pg-core";

export const textDirectionEnum = pgEnum("text_direction", ["ltr", "rtl"]);

export const locales = pgTable(
  "locales",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").unique().notNull(),
    name: text("name").notNull(),
    nativeName: text("native_name"),
    textDirection: textDirectionEnum("text_direction").notNull().default("ltr"),
    script: text("script"),
    pluralRule: text("plural_rule"),
    pluralForms: integer("plural_forms").notNull().default(2),
    isDefault: boolean("is_default").notNull().default(false),
    isEnabled: boolean("is_enabled").notNull().default(true),
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
  },
  (table) => [
    index("idx_locales_is_enabled").on(table.isEnabled),
  ]
);
