// pipeline_stages: ordered stages within a pipeline with win probability.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { pipelines } from "./pipelines";

export const pipelineStages = pgTable(
  "pipeline_stages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pipelineId: uuid("pipeline_id").notNull().references(() => pipelines.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    position: integer("position").notNull().default(0),
    winProbability: integer("win_probability"),
    isClosedWon: boolean("is_closed_won").notNull().default(false),
    isClosedLost: boolean("is_closed_lost").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_pipeline_stages_pipeline_id_position").on(table.pipelineId, table.position),
  ]
);
