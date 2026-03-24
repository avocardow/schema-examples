// deals: sales opportunities tracked through pipeline stages to close.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, numeric, timestamp, index } from "drizzle-orm/pg-core";
import { pipelines } from "./pipelines";
import { pipelineStages } from "./pipeline_stages";
import { users } from "./users";
import { companies } from "./companies";
import { contacts } from "./contacts";

export const dealPriorityEnum = pgEnum("deal_priority", [
  "low",
  "medium",
  "high",
]);

export const deals = pgTable(
  "deals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    pipelineId: uuid("pipeline_id").notNull().references(() => pipelines.id, { onDelete: "restrict" }),
    stageId: uuid("stage_id").references(() => pipelineStages.id, { onDelete: "set null" }),
    value: numeric("value"),
    currency: text("currency").notNull().default("USD"),
    expectedCloseDate: text("expected_close_date"),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    lostReason: text("lost_reason"),
    priority: dealPriorityEnum("priority").notNull().default("medium"),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
    contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_deals_pipeline_stage").on(table.pipelineId, table.stageId),
    index("idx_deals_owner_id").on(table.ownerId),
    index("idx_deals_company_id").on(table.companyId),
    index("idx_deals_contact_id").on(table.contactId),
    index("idx_deals_expected_close_date").on(table.expectedCloseDate),
    index("idx_deals_closed_at").on(table.closedAt),
  ]
);
