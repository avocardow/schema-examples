// metadata_schemas: Defines custom metadata fields per workspace for asset enrichment.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, integer, jsonb, timestamp, unique } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const metadataFieldTypeEnum = pgEnum("metadata_field_type", [
  "text",
  "number",
  "date",
  "boolean",
  "single_select",
  "multi_select",
]);

export const metadataSchemas = pgTable(
  "metadata_schemas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    fieldName: text("field_name").notNull(),
    fieldLabel: text("field_label").notNull(),
    fieldType: metadataFieldTypeEnum("field_type").notNull(),
    options: jsonb("options"),
    isRequired: boolean("is_required").notNull().default(false),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_metadata_schemas_workspace_id_field_name").on(table.workspaceId, table.fieldName),
  ]
);
