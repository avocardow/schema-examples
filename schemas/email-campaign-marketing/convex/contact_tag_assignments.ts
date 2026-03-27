// contact_tag_assignments: Many-to-many relationship between contacts and tags.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const contactTagAssignments = defineTable({
  contactId: v.id("contacts"),
  tagId: v.id("tags"),
})
  .index("by_contact_id_tag_id", ["contactId", "tagId"])
  .index("by_tag_id", ["tagId"]);
