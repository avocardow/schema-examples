// tasks: action items assigned to users, linked to contacts, companies, or deals.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { contacts } from "./contacts";
import { companies } from "./companies";
import { deals } from "./deals";
import { dealPriorityEnum } from "./deals";
import { users } from "./users";

export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "completed",
  "cancelled",
]);

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    dueDate: text("due_date"),
    priority: dealPriorityEnum("priority").notNull().default("medium"),
    status: taskStatusEnum("status").notNull().default("todo"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "set null" }),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
    dealId: uuid("deal_id").references(() => deals.id, { onDelete: "set null" }),
    ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_tasks_owner_status").on(table.ownerId, table.status),
    index("idx_tasks_due_date").on(table.dueDate),
    index("idx_tasks_contact_id").on(table.contactId),
    index("idx_tasks_deal_id").on(table.dealId),
  ]
);
