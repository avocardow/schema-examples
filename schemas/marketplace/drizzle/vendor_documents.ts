// vendor_documents: Uploaded verification documents with review status tracking.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { vendors } from "./vendors";
import { users } from "../../auth-rbac/drizzle/users";

export const vendorDocumentType = pgEnum("vendor_document_type", [
  "business_license",
  "tax_certificate",
  "identity_proof",
  "bank_statement",
  "other",
]);

export const vendorDocumentStatus = pgEnum("vendor_document_status", [
  "pending",
  "approved",
  "rejected",
]);

export const vendorDocuments = pgTable(
  "vendor_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => vendors.id, { onDelete: "cascade" }),
    type: vendorDocumentType("type").notNull(),
    fileUrl: text("file_url").notNull(),
    fileName: text("file_name").notNull(),
    status: vendorDocumentStatus("status").notNull().default("pending"),
    rejectionReason: text("rejection_reason"),
    reviewedBy: uuid("reviewed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_vendor_documents_vendor_id_type").on(
      table.vendorId,
      table.type
    ),
    index("idx_vendor_documents_status").on(table.status),
  ]
);
