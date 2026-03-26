// control_requirements: Maps controls to framework requirements (many-to-many).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const controlRequirements = defineTable({
  controlId: v.id("controls"),
  requirementId: v.id("framework_requirements"),
  notes: v.optional(v.string()),
})
  .index("by_control_id_and_requirement_id", ["controlId", "requirementId"]);
