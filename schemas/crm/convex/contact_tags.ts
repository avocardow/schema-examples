// contact_tags: many-to-many join between contacts and tags.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const contactTags = defineTable({
  contactId: v.id("contacts"),
  tagId: v.id("tags"),
})
  .index("by_contact_id_and_tag_id", ["contactId", "tagId"])
  .index("by_tag_id", ["tagId"]);
