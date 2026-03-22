// file_attachments: Polymorphic join table — attach files to any entity in any domain.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const file_attachments = defineTable({
  fileId: v.id("files"), // The attached file. Cascade: deleting a file removes all its attachment records.

  // Polymorphic target: what entity this file is attached to.
  // Not FKs — the target table depends on the consuming domain.
  recordType: v.string(), // Entity type (e.g., "products", "users", "posts", "tickets").
  recordId: v.string(), // Entity primary key (UUID stored as string).

  name: v.string(), // Attachment slot/purpose (e.g., "avatar", "cover_image", "documents").
  position: v.number(), // Ordering within a slot. Allows drag-and-drop reordering.
  // no createdAt — Convex provides _creationTime
})
  .index("by_file_id", ["fileId"])
  .index("by_record_type_record_id_name_file_id", ["recordType", "recordId", "name", "fileId"])
  .index("by_record_type_record_id", ["recordType", "recordId"]);
