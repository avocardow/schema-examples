// policy_acknowledgments: Records of users acknowledging specific policy versions.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, unique, index, pgEnum } from "drizzle-orm/pg-core";
import { policyVersions } from "./policy_versions";
import { users } from "./users";

export const acknowledgmentMethodEnum = pgEnum("acknowledgment_method", [
  "click_through",
  "electronic_signature",
  "manual",
]);

export const policyAcknowledgments = pgTable(
  "policy_acknowledgments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    policyVersionId: uuid("policy_version_id")
      .notNull()
      .references(() => policyVersions.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }).notNull(),
    method: acknowledgmentMethodEnum("method").notNull().default("click_through"),
    ipAddress: text("ip_address"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_policy_acknowledgments_policy_version_id_user_id").on(table.policyVersionId, table.userId),
    index("idx_policy_acknowledgments_user_id").on(table.userId),
    index("idx_policy_acknowledgments_acknowledged_at").on(table.acknowledgedAt),
  ]
);
