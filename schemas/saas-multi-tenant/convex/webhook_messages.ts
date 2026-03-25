// webhook_messages: Inbound or outbound webhook event payloads tied to an organization.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const webhook_messages = defineTable({
  organizationId: v.id("organizations"),
  eventTypeId: v.id("webhook_event_types"),
  eventId: v.string(),
  payload: v.any(),
})
  .index("by_organization_id_and_creation_time", [
    "organizationId",
    "_creationTime",
  ])
  .index("by_event_type_id", ["eventTypeId"])
  .index("by_event_id", ["eventId"]);
