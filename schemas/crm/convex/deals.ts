// deals: sales opportunities tracked through pipeline stages.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const deals = defineTable({
  name: v.string(),
  pipelineId: v.id("pipelines"),
  stageId: v.optional(v.id("pipeline_stages")),
  value: v.optional(v.number()),
  currency: v.string(),
  expectedCloseDate: v.optional(v.string()),
  closedAt: v.optional(v.number()),
  lostReason: v.optional(v.string()),
  priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  ownerId: v.optional(v.id("users")),
  companyId: v.optional(v.id("companies")),
  contactId: v.optional(v.id("contacts")),
  updatedAt: v.number(),
})
  .index("by_pipeline_id_and_stage_id", ["pipelineId", "stageId"])
  .index("by_owner_id", ["ownerId"])
  .index("by_company_id", ["companyId"])
  .index("by_contact_id", ["contactId"])
  .index("by_expected_close_date", ["expectedCloseDate"])
  .index("by_closed_at", ["closedAt"]);
