// translation_groups: Groups of translations for a specific content entity.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { translatableResources } from "./translatable_resources";
import { locales } from "./locales";

export const translationGroups = pgTable(
  "translation_groups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    resourceId: uuid("resource_id")
      .notNull()
      .references(() => translatableResources.id, { onDelete: "cascade" }),
    entityId: text("entity_id").notNull(),
    sourceLocaleId: uuid("source_locale_id")
      .notNull()
      .references(() => locales.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("uq_translation_groups_resource_id_entity_id").on(
      table.resourceId,
      table.entityId
    ),
    index("idx_translation_groups_source_locale_id").on(table.sourceLocaleId),
  ]
);
