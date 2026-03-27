// automation_workflows: Defines triggered email automation sequences.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index, jsonb, boolean, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const triggerType = pgEnum("trigger_type", [
  "list_join",
  "tag_added",
  "manual",
  "event",
]);

export const automationWorkflows = pgTable(
  "automation_workflows",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    triggerType: triggerType("trigger_type").notNull(),
    triggerConfig: jsonb("trigger_config").default(sql`'{}'`),
    isActive: boolean("is_active").notNull().default(true),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_automation_workflows_is_active").on(table.isActive),
    index("idx_automation_workflows_trigger_type").on(table.triggerType),
  ],
);
