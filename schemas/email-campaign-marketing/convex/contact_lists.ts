// contact_lists: Named lists for organizing contacts into mailing groups.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const contactLists = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  createdBy: v.optional(v.id("users")),
  updatedAt: v.number(),
})
  .index("by_created_by", ["createdBy"]);
