// evidence: Artifacts collected to demonstrate control effectiveness.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const evidence = defineTable({
  controlId: v.id("controls"),
  auditId: v.optional(v.id("audits")),
  fileId: v.optional(v.id("files")),
  collectedBy: v.optional(v.id("users")),
  title: v.string(),
  evidenceType: v.union(
    v.literal("document"),
    v.literal("screenshot"),
    v.literal("log_export"),
    v.literal("automated_test"),
    v.literal("manual_review"),
    v.literal("certification")
  ),
  description: v.optional(v.string()),
  collectedAt: v.number(),
  validFrom: v.optional(v.string()),
  validUntil: v.optional(v.string()),
})
  .index("by_control_id", ["controlId"])
  .index("by_audit_id", ["auditId"])
  .index("by_collected_by", ["collectedBy"])
  .index("by_evidence_type", ["evidenceType"])
  .index("by_collected_at", ["collectedAt"]);
