// experiment_variants: Variants within experiments.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const experiment_variants = defineTable({
  experimentId: v.id("experiments"),
  name: v.string(),
  description: v.optional(v.string()),
  isControl: v.boolean(),
  weight: v.number(),
  config: v.optional(v.any()),
})
  .index("by_experiment_id_and_name", ["experimentId", "name"]);
