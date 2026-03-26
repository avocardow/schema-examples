// risks: Identified risks with categorization, scoring, treatment strategy, and lifecycle status.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, timestamp, unique, index, pgEnum } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { users } from "./users";

export const riskCategoryEnum = pgEnum("risk_category", [
  "strategic",
  "operational",
  "financial",
  "compliance",
  "reputational",
  "technical",
  "third_party",
]);

export const riskLevelEnum = pgEnum("risk_level", [
  "critical",
  "high",
  "medium",
  "low",
  "very_low",
]);

export const riskTreatmentEnum = pgEnum("risk_treatment", [
  "mitigate",
  "accept",
  "transfer",
  "avoid",
]);

export const riskStatusEnum = pgEnum("risk_status", [
  "identified",
  "assessing",
  "treating",
  "monitoring",
  "closed",
]);

export const risks = pgTable(
  "risks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    identifier: text("identifier"),
    title: text("title").notNull(),
    description: text("description"),
    category: riskCategoryEnum("category").notNull(),
    likelihood: integer("likelihood").notNull().default(3),
    impact: integer("impact").notNull().default(3),
    riskLevel: riskLevelEnum("risk_level").notNull().default("medium"),
    treatment: riskTreatmentEnum("treatment").notNull().default("mitigate"),
    status: riskStatusEnum("status").notNull().default("identified"),
    dueDate: text("due_date"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_risks_identifier").on(table.identifier),
    index("idx_risks_organization_id").on(table.organizationId),
    index("idx_risks_owner_id").on(table.ownerId),
    index("idx_risks_category").on(table.category),
    index("idx_risks_risk_level").on(table.riskLevel),
    index("idx_risks_status").on(table.status),
  ]
);
