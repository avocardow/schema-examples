// promo_code_ticket_types: Maps promo codes to eligible ticket types.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const promoCodeTicketTypesSchema = new mongoose.Schema(
  {
    promo_code_id: { type: mongoose.Schema.Types.ObjectId, ref: "PromoCode", required: true },
    ticket_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "TicketType", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

promoCodeTicketTypesSchema.index({ promo_code_id: 1, ticket_type_id: 1 }, { unique: true });
promoCodeTicketTypesSchema.index({ ticket_type_id: 1 });

module.exports = mongoose.model("PromoCodeTicketType", promoCodeTicketTypesSchema);
