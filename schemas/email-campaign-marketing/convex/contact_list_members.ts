// contact_list_members: Tracks which contacts belong to which lists with subscription status.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const contactListMembers = defineTable({
  contactId: v.id("contacts"),
  listId: v.id("contactLists"),
  status: v.union(
    v.literal("subscribed"),
    v.literal("unsubscribed"),
    v.literal("unconfirmed")
  ),
  subscribedAt: v.optional(v.number()),
  unsubscribedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_contact_id_list_id", ["contactId", "listId"])
  .index("by_list_id_status", ["listId", "status"]);
