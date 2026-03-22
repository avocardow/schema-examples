// experiment_results: Statistical results per variant and metric for experiment analysis.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  numeric,
  bigint,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { experiments } from "./experiments";
import { experimentVariants } from "./experiment_variants";
import { metricDefinitions } from "./metric_definitions";

export const experimentResults = pgTable(
  "experiment_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    experimentId: uuid("experiment_id").notNull().references(() => experiments.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").notNull().references(() => experimentVariants.id, { onDelete: "cascade" }),
    metricId: uuid("metric_id").notNull().references(() => metricDefinitions.id, { onDelete: "cascade" }),
    sampleSize: bigint("sample_size", { mode: "number" }).notNull().default(0),
    meanValue: numeric("mean_value"),
    stddev: numeric("stddev"),
    ciLower: numeric("ci_lower"),
    ciUpper: numeric("ci_upper"),
    pValue: numeric("p_value"),
    lift: numeric("lift"),
    isSignificant: boolean("is_significant").notNull().default(false),
    computedAt: timestamp("computed_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("idx_experiment_results_experiment_variant_metric").on(table.experimentId, table.variantId, table.metricId),
  ]
);
