// funnel_steps: Ordered steps within a conversion funnel tied to event types.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { funnels } from "./funnels";
import { eventTypes } from "./event_types";

export const funnelSteps = pgTable(
  "funnel_steps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    funnelId: uuid("funnel_id").notNull().references(() => funnels.id, { onDelete: "cascade" }),
    eventTypeId: uuid("event_type_id").notNull().references(() => eventTypes.id, { onDelete: "restrict" }),
    stepOrder: integer("step_order").notNull(),
    name: text("name"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_funnel_steps_funnel_id_step_order").on(table.funnelId, table.stepOrder),
    uniqueIndex("idx_funnel_steps_funnel_id_event_type_id").on(table.funnelId, table.eventTypeId),
  ]
);
