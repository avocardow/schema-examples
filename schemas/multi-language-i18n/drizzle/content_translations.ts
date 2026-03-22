// content_translations: Translated field values for arbitrary content entities.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, timestamp, index, unique } from "drizzle-orm/pg-core";
import { translatableResources } from "./translatable_resources";
import { locales } from "./locales";
import { users } from "../../auth-rbac/drizzle/users";
import { translationValueStatusEnum } from "./translation_values";

export const contentTranslations = pgTable(
  "content_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    resourceId: uuid("resource_id")
      .notNull()
      .references(() => translatableResources.id, { onDelete: "cascade" }),
    entityId: text("entity_id").notNull(),
    localeId: uuid("locale_id")
      .notNull()
      .references(() => locales.id, { onDelete: "cascade" }),
    fieldName: text("field_name").notNull(),
    value: text("value").notNull(),
    status: translationValueStatusEnum("status").notNull().default("draft"),
    sourceDigest: text("source_digest"),
    translatorId: uuid("translator_id").references(() => users.id, {
      onDelete: "set null",
    }),
    version: integer("version").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("uq_content_translations_resource_id_entity_id_locale_id_field_name").on(
      table.resourceId,
      table.entityId,
      table.localeId,
      table.fieldName
    ),
    index("idx_content_translations_resource_id_entity_id").on(
      table.resourceId,
      table.entityId
    ),
    index("idx_content_translations_locale_id").on(table.localeId),
    index("idx_content_translations_status").on(table.status),
  ]
);
