// employee_documents: Documents associated with employees such as contracts, tax forms, and certifications.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";
import { files } from "./files";
import { users } from "./users";

export const documentTypeEnum = pgEnum("document_type", [
  "contract",
  "tax_form",
  "identification",
  "certification",
  "offer_letter",
  "performance_review",
  "other",
]);

export const documentStatusEnum = pgEnum("document_status", [
  "active",
  "expired",
  "superseded",
  "archived",
]);

export const employeeDocuments = pgTable(
  "employee_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    fileId: uuid("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),
    type: documentTypeEnum("type").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    issuedDate: text("issued_date"),
    expiryDate: text("expiry_date"),
    status: documentStatusEnum("status").notNull().default("active"),
    uploadedBy: uuid("uploaded_by")
      .references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_employee_documents_employee_id").on(table.employeeId),
    index("idx_employee_documents_file_id").on(table.fileId),
    index("idx_employee_documents_type").on(table.type),
    index("idx_employee_documents_expiry_date").on(table.expiryDate),
    index("idx_employee_documents_status").on(table.status),
  ]
);
