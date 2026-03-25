// sla_policy_targets: per-priority response and resolution time targets for an SLA policy.
// See README.md for full design rationale.

import { pgTable, uuid, integer, uniqueIndex } from "drizzle-orm/pg-core";
import { slaPolicies } from "./sla_policies";
import { ticketPriorities } from "./ticket_priorities";

export const slaPolicyTargets = pgTable(
  "sla_policy_targets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slaPolicyId: uuid("sla_policy_id").notNull().references(() => slaPolicies.id, { onDelete: "cascade" }),
    priorityId: uuid("priority_id").notNull().references(() => ticketPriorities.id, { onDelete: "cascade" }),
    firstResponseMinutes: integer("first_response_minutes"),
    nextResponseMinutes: integer("next_response_minutes"),
    resolutionMinutes: integer("resolution_minutes"),
  },
  (table) => [
    uniqueIndex("uq_sla_policy_targets_sla_policy_id_priority_id").on(table.slaPolicyId, table.priorityId),
  ]
);
