// experiment_variants: Variant definitions for A/B test experiments with traffic weights.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  boolean,
  numeric,
  jsonb,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { experiments } from "./experiments";

export const experimentVariants = pgTable(
  "experiment_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    experimentId: uuid("experiment_id").notNull().references(() => experiments.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    isControl: boolean("is_control").notNull().default(false),
    weight: numeric("weight").notNull().default("0.5"),
    config: jsonb("config"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_experiment_variants_experiment_id_name").on(table.experimentId, table.name),
  ]
);
