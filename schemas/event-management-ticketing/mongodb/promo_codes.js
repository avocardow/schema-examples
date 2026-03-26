// promo_codes: Discount codes applicable to event ticket purchases.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const promoCodesSchema = new mongoose.Schema(
  {
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    code: { type: String, required: true },
    discount_type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discount_value: { type: Number, required: true },
    currency: { type: String, default: null },
    max_uses: { type: Number, default: null },
    times_used: { type: Number, required: true, default: 0 },
    max_uses_per_order: { type: Number, required: true, default: 1 },
    valid_from: { type: Date, default: null },
    valid_until: { type: Date, default: null },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

promoCodesSchema.index({ event_id: 1, code: 1 }, { unique: true });
promoCodesSchema.index({ is_active: 1 });

module.exports = mongoose.model("PromoCode", promoCodesSchema);
