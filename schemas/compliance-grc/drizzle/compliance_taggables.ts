// compliance_taggables: Polymorphic join table linking tags to controls, risks, policies, audits, findings, and evidence.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, unique, index, pgEnum } from "drizzle-orm/pg-core";
import { complianceTags } from "./compliance_tags";

export const taggableTypeEnum = pgEnum("taggable_type", [
  "control",
  "risk",
  "policy",
  "audit",
  "finding",
  "evidence",
]);

export const complianceTaggables = pgTable(
  "compliance_taggables",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => complianceTags.id, { onDelete: "cascade" }),
    taggableType: taggableTypeEnum("taggable_type").notNull(),
    taggableId: uuid("taggable_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_compliance_taggables_tag_id_taggable_type_taggable_id").on(table.tagId, table.taggableType, table.taggableId),
    index("idx_compliance_taggables_taggable_type").on(table.taggableType),
    index("idx_compliance_taggables_taggable_id").on(table.taggableId),
  ]
);
