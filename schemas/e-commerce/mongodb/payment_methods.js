// payment_methods: Stored payment instruments linked to users for checkout and recurring billing.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const paymentMethodsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["card", "bank_account", "paypal", "apple_pay", "google_pay"],
      required: true,
    },
    provider: { type: String, required: true },
    provider_id: { type: String, required: true },
    label: { type: String, default: null },
    last_four: { type: String, default: null },
    brand: { type: String, default: null },
    exp_month: { type: Number, default: null },
    exp_year: { type: Number, default: null },
    is_default: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

paymentMethodsSchema.index({ user_id: 1 });
paymentMethodsSchema.index({ provider: 1, provider_id: 1 }, { unique: true });

module.exports = mongoose.model("PaymentMethod", paymentMethodsSchema);
