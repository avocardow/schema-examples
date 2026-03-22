// experiment_goals: Links experiments to goals.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const experiment_goals = defineTable({
  experimentId: v.id("experiments"),
  goalId: v.id("goals"),
  isPrimary: v.boolean(),
})
  .index("by_experiment_id_and_goal_id", ["experimentId", "goalId"])
  .index("by_goal_id", ["goalId"]);
