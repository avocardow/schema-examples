// custom_fields: user-defined field definitions scoped to an entity type.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const crmEntityTypeEnum = pgEnum("crm_entity_type", [
  "contact",
  "company",
  "deal",
  "lead",
]);

export const customFieldTypeEnum = pgEnum("custom_field_type", [
  "text",
  "number",
  "date",
  "select",
  "multi_select",
  "checkbox",
  "url",
]);

export const customFields = pgTable(
  "custom_fields",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    entityType: crmEntityTypeEnum("entity_type").notNull(),
    name: text("name").notNull(),
    fieldType: customFieldTypeEnum("field_type").notNull(),
    description: text("description"),
    isRequired: boolean("is_required").notNull().default(false),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_custom_fields_entity_type_position").on(table.entityType, table.position),
  ]
);
