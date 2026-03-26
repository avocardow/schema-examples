// promo_code_ticket_types: many-to-many link restricting promo codes to specific ticket types.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const promo_code_ticket_types = defineTable({
  promoCodeId: v.id("promo_codes"),
  ticketTypeId: v.id("ticket_types"),
})
  .index("by_promo_code_id_ticket_type_id", ["promoCodeId", "ticketTypeId"])
  .index("by_ticket_type_id", ["ticketTypeId"]);
