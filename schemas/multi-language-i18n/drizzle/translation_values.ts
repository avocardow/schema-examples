// translation_values: Translated string values per key, locale, and plural category.
// See README.md for full design rationale.

import { pgEnum, pgTable, uuid, text, boolean, timestamp, index, unique } from "drizzle-orm/pg-core";
import { translationKeys } from "./translation_keys";
import { locales } from "./locales";
import { users } from "../../auth-rbac/drizzle/users";

export const translationValueStatusEnum = pgEnum("translation_value_status", [
  "draft",
  "in_review",
  "approved",
  "published",
  "rejected",
]);

export const translationValues = pgTable(
  "translation_values",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    translationKeyId: uuid("translation_key_id")
      .notNull()
      .references(() => translationKeys.id, { onDelete: "cascade" }),
    localeId: uuid("locale_id")
      .notNull()
      .references(() => locales.id, { onDelete: "cascade" }),
    pluralCategory: text("plural_category"),
    value: text("value").notNull(),
    status: translationValueStatusEnum("status").notNull().default("draft"),
    isMachineTranslated: boolean("is_machine_translated")
      .notNull()
      .default(false),
    sourceDigest: text("source_digest"),
    translatorId: uuid("translator_id").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedBy: uuid("reviewed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("uq_translation_values_translation_key_id_locale_id_plural_category").on(
      table.translationKeyId,
      table.localeId,
      table.pluralCategory
    ),
    index("idx_translation_values_locale_id_status").on(
      table.localeId,
      table.status
    ),
    index("idx_translation_values_status").on(table.status),
    index("idx_translation_values_translator_id").on(table.translatorId),
  ]
);
