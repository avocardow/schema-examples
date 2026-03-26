// risk_controls: Maps risks to the controls that mitigate them.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, unique } from "drizzle-orm/pg-core";
import { risks } from "./risks";
import { controls } from "./controls";

export const riskControls = pgTable(
  "risk_controls",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    riskId: uuid("risk_id")
      .notNull()
      .references(() => risks.id, { onDelete: "cascade" }),
    controlId: uuid("control_id")
      .notNull()
      .references(() => controls.id, { onDelete: "cascade" }),
    effectivenessNotes: text("effectiveness_notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_risk_controls_risk_id_control_id").on(table.riskId, table.controlId),
  ]
);
