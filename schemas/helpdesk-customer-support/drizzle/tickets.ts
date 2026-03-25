// tickets: central support requests with subject, description, status, priority, assignment, and SLA tracking.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { ticketStatuses } from "./ticket_statuses";
import { ticketPriorities } from "./ticket_priorities";
import { ticketCategories } from "./ticket_categories";
import { users } from "./users";
import { slaPolicies } from "./sla_policies";

export const ticketTypeEnum = pgEnum("ticket_type", [
  "question",
  "incident",
  "problem",
  "feature_request",
]);

export const ticketSourceEnum = pgEnum("ticket_source", [
  "email",
  "web",
  "phone",
  "api",
  "social",
]);

export const tickets = pgTable(
  "tickets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subject: text("subject").notNull(),
    description: text("description"),
    statusId: uuid("status_id").notNull().references(() => ticketStatuses.id, { onDelete: "restrict" }),
    priorityId: uuid("priority_id").notNull().references(() => ticketPriorities.id, { onDelete: "restrict" }),
    type: ticketTypeEnum("type").notNull().default("question"),
    source: ticketSourceEnum("source").notNull().default("web"),
    categoryId: uuid("category_id").references(() => ticketCategories.id, { onDelete: "set null" }),
    requesterId: uuid("requester_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    assignedAgentId: uuid("assigned_agent_id").references(() => users.id, { onDelete: "set null" }),
    assignedTeamId: uuid("assigned_team_id"),
    slaPolicyId: uuid("sla_policy_id").references(() => slaPolicies.id, { onDelete: "set null" }),
    dueAt: timestamp("due_at", { withTimezone: true }),
    firstResponseAt: timestamp("first_response_at", { withTimezone: true }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_tickets_status_id").on(table.statusId),
    index("idx_tickets_priority_id").on(table.priorityId),
    index("idx_tickets_requester_id").on(table.requesterId),
    index("idx_tickets_assigned_agent_id").on(table.assignedAgentId),
    index("idx_tickets_assigned_team_id").on(table.assignedTeamId),
    index("idx_tickets_category_id").on(table.categoryId),
    index("idx_tickets_sla_policy_id").on(table.slaPolicyId),
    index("idx_tickets_created_at").on(table.createdAt),
    index("idx_tickets_due_at").on(table.dueAt),
  ]
);
