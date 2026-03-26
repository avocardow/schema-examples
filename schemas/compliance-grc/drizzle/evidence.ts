// evidence: Compliance evidence artifacts collected for controls and audits.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { controls } from "./controls";
import { audits } from "./audits";
import { files } from "./files";
import { users } from "./users";

export const evidenceTypeEnum = pgEnum("evidence_type", [
  "document",
  "screenshot",
  "log_export",
  "automated_test",
  "manual_review",
  "certification",
]);

export const evidence = pgTable(
  "evidence",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    controlId: uuid("control_id")
      .notNull()
      .references(() => controls.id, { onDelete: "cascade" }),
    auditId: uuid("audit_id").references(() => audits.id, { onDelete: "set null" }),
    fileId: uuid("file_id").references(() => files.id, { onDelete: "set null" }),
    collectedBy: uuid("collected_by").references(() => users.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    evidenceType: evidenceTypeEnum("evidence_type").notNull(),
    description: text("description"),
    collectedAt: timestamp("collected_at", { withTimezone: true }).notNull(),
    validFrom: text("valid_from"),
    validUntil: text("valid_until"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_evidence_control_id").on(table.controlId),
    index("idx_evidence_audit_id").on(table.auditId),
    index("idx_evidence_collected_by").on(table.collectedBy),
    index("idx_evidence_evidence_type").on(table.evidenceType),
    index("idx_evidence_collected_at").on(table.collectedAt),
  ]
);
