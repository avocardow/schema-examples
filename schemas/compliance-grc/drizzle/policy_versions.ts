// policy_versions: Versioned snapshots of policy content with approval workflow tracking.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, unique, index, pgEnum } from "drizzle-orm/pg-core";
import { policies } from "./policies";
import { files } from "./files";
import { users } from "./users";

export const policyVersionStatusEnum = pgEnum("policy_version_status", [
  "draft",
  "in_review",
  "approved",
  "archived",
]);

export const policyVersions = pgTable(
  "policy_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    policyId: uuid("policy_id")
      .notNull()
      .references(() => policies.id, { onDelete: "cascade" }),
    versionNumber: text("version_number").notNull(),
    content: text("content"),
    fileId: uuid("file_id").references(() => files.id, { onDelete: "set null" }),
    status: policyVersionStatusEnum("status").notNull().default("draft"),
    approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    effectiveDate: text("effective_date"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_policy_versions_policy_id_version_number").on(table.policyId, table.versionNumber),
    index("idx_policy_versions_status").on(table.status),
    index("idx_policy_versions_approved_by").on(table.approvedBy),
  ]
);
