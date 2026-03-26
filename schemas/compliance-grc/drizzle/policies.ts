// policies: Organizational policies, standards, procedures, and guidelines with review scheduling.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { users } from "./users";

export const policyTypeEnum = pgEnum("policy_type", [
  "policy",
  "standard",
  "procedure",
  "guideline",
]);

export const reviewFrequencyEnum = pgEnum("review_frequency", [
  "monthly",
  "quarterly",
  "semi_annually",
  "annually",
  "biennially",
]);

export const policies = pgTable(
  "policies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    policyType: policyTypeEnum("policy_type").notNull().default("policy"),
    description: text("description"),
    reviewFrequency: reviewFrequencyEnum("review_frequency").notNull().default("annually"),
    nextReviewDate: text("next_review_date"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_policies_organization_id").on(table.organizationId),
    index("idx_policies_owner_id").on(table.ownerId),
    index("idx_policies_policy_type").on(table.policyType),
    index("idx_policies_is_active").on(table.isActive),
  ]
);
