// locale_plural_rules: Plural rules configuration for specific locales.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { locales } from "./locales";

export const pluralCategoryEnum = pgEnum("plural_category", [
  "zero",
  "one",
  "two",
  "few",
  "many",
  "other",
]);

export const localePluralRules = pgTable(
  "locale_plural_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    localeId: uuid("locale_id")
      .notNull()
      .references(() => locales.id, { onDelete: "cascade" }),
    category: pluralCategoryEnum("category").notNull(),
    example: text("example"),
    ruleFormula: text("rule_formula"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_locale_plural_rules_locale_id_category").on(
      table.localeId,
      table.category
    ),
  ]
);
