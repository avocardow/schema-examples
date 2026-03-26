// controls: Security and compliance controls with type, category, frequency, and effectiveness tracking.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, unique, index, pgEnum } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { users } from "./users";

export const controlTypeEnum = pgEnum("control_type", [
  "preventive",
  "detective",
  "corrective",
  "directive",
]);

export const controlCategoryEnum = pgEnum("control_category", [
  "technical",
  "administrative",
  "physical",
]);

export const controlFrequencyEnum = pgEnum("control_frequency", [
  "continuous",
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "annually",
  "as_needed",
]);

export const controlStatusEnum = pgEnum("control_status", [
  "draft",
  "active",
  "inactive",
  "deprecated",
]);

export const controlEffectivenessEnum = pgEnum("control_effectiveness", [
  "not_assessed",
  "effective",
  "partially_effective",
  "ineffective",
]);

export const controls = pgTable(
  "controls",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    identifier: text("identifier"),
    title: text("title").notNull(),
    description: text("description"),
    controlType: controlTypeEnum("control_type").notNull(),
    category: controlCategoryEnum("category").notNull(),
    frequency: controlFrequencyEnum("frequency").notNull().default("continuous"),
    status: controlStatusEnum("status").notNull().default("draft"),
    effectiveness: controlEffectivenessEnum("effectiveness").notNull().default("not_assessed"),
    implementationNotes: text("implementation_notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_controls_identifier").on(table.identifier),
    index("idx_controls_organization_id").on(table.organizationId),
    index("idx_controls_owner_id").on(table.ownerId),
    index("idx_controls_status").on(table.status),
    index("idx_controls_control_type").on(table.controlType),
    index("idx_controls_category").on(table.category),
  ]
);
