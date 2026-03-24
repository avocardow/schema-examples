// pipeline_stages: ordered stages within a pipeline with win probability tracking.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const pipelineStages = defineTable({
  pipelineId: v.id("pipelines"),
  name: v.string(),
  position: v.number(),
  winProbability: v.optional(v.number()),
  isClosedWon: v.boolean(),
  isClosedLost: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_pipeline_id_and_position", ["pipelineId", "position"]);
