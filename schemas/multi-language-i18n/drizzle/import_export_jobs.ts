// import_export_jobs: Background jobs for importing/exporting translation data.
// See README.md for full design rationale.

import { pgEnum, pgTable, uuid, text, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { locales } from "./locales";
import { namespaces } from "./namespaces";
import { users } from "../../auth-rbac/drizzle/users";

export const importExportTypeEnum = pgEnum("import_export_type", [
  "import",
  "export",
]);

export const importExportStatusEnum = pgEnum("import_export_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const importExportJobs = pgTable(
  "import_export_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: importExportTypeEnum("type").notNull(),
    format: text("format").notNull(),
    status: importExportStatusEnum("status").notNull().default("pending"),
    localeId: uuid("locale_id").references(() => locales.id, {
      onDelete: "set null",
    }),
    namespaceId: uuid("namespace_id").references(() => namespaces.id, {
      onDelete: "set null",
    }),
    filePath: text("file_path"),
    totalCount: integer("total_count").notNull().default(0),
    processedCount: integer("processed_count").notNull().default(0),
    errorMessage: text("error_message"),
    options: jsonb("options"),
    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_import_export_jobs_status").on(table.status),
    index("idx_import_export_jobs_created_by").on(table.createdBy),
    index("idx_import_export_jobs_type_status").on(table.type, table.status),
  ]
);
