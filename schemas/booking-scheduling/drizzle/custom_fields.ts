// custom_fields: configurable intake form fields attached to a service.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, integer, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { services } from "./services";

export const customFieldTypeEnum = pgEnum("custom_field_type", [
  "text",
  "textarea",
  "select",
  "multi_select",
  "checkbox",
  "number",
  "date",
  "phone",
  "email",
]);

export const customFields = pgTable(
  "custom_fields",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    fieldType: customFieldTypeEnum("field_type").notNull(),
    placeholder: text("placeholder"),
    isRequired: boolean("is_required").notNull().default(false),
    options: jsonb("options"),
    position: integer("position").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_custom_fields_service_id_position").on(table.serviceId, table.position),
  ]
);
