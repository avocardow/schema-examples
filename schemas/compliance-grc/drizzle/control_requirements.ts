// control_requirements: Maps controls to framework requirements they satisfy.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, unique } from "drizzle-orm/pg-core";
import { controls } from "./controls";
import { frameworkRequirements } from "./framework_requirements";

export const controlRequirements = pgTable(
  "control_requirements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    controlId: uuid("control_id")
      .notNull()
      .references(() => controls.id, { onDelete: "cascade" }),
    requirementId: uuid("requirement_id")
      .notNull()
      .references(() => frameworkRequirements.id, { onDelete: "cascade" }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_control_requirements_control_id_requirement_id").on(table.controlId, table.requirementId),
  ]
);
