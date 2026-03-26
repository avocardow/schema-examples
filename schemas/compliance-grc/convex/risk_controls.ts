// risk_controls: Maps risks to their mitigating controls (many-to-many).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const riskControls = defineTable({
  riskId: v.id("risks"),
  controlId: v.id("controls"),
  effectivenessNotes: v.optional(v.string()),
})
  .index("by_risk_id_and_control_id", ["riskId", "controlId"]);
